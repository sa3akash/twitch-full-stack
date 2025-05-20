/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'
import * as OTPAuth from 'otpauth'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { destroySession, saveSession } from '@/src/shared/utils/session.utils'

import { VerificationService } from '../verification/verification.service'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'

@Injectable()
export class SessionsService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly verificationService: VerificationService
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId
		if (!userId) throw new NotFoundException('UserId not found.')

		const keys = await this.redisService.keys('*')
		const userSessions: any[] = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)
			if (sessionData) {
				const session = JSON.parse(sessionData)
				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(':')[1]
					})
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt)

		return userSessions.filter(s => s.id !== req.session.id)
	}

	public async findCurrent(req: Request): Promise<SessionModel> {
		const sessionId = req.session.id
		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		const session = JSON.parse(sessionData || '')

		return {
			...session,
			id: sessionId
		}
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ email: { equals: input.login } },
					{ username: { equals: input.login } }
				]
			}
		})

		if (!user || !(await verify(user.password, input.password))) {
			throw new BadRequestException('Invalid credentials.')
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)

			throw new BadRequestException(
				'Your account is not verified. Please check your email to confirm.'
			)
		}

		if (user.isTotpEnabled) {
			if (!input.pin) {
				return {
					message: 'Give me authenticator pin.'
				}
			}

			const totp = new OTPAuth.TOTP({
				issuer: 'SA2 Auth',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: user.totpSecret!
			})

			const delta = totp.validate({ token: input.pin })

			if (delta === null) {
				throw new BadRequestException('Invalid pin code.')
			}
		}

		return saveSession(req, user, userAgent)
	}

	public async logout(req: Request) {
		return destroySession(req, this.configService)
	}

	public clearSessions(req: Request) {
		req.res?.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME')
		)

		return true
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('You can not remove your session.')
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)

		return true
	}
}
