import {
	BadGatewayException,
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.utils'

import { MailService } from '../../libs/mail/mail.service'

import { DeactivateInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}

	private async validateDeactivateToken(req: Request, token: string) {
		const existToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.DEACTIVATE_ACCOUNT }
		})

		if (!existToken) {
			throw new NotFoundException('Token not found.')
		}

		const hasExpired = new Date(existToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token expired.')
		}

		await this.prismaService.user.update({
			where: { id: existToken.userId! },
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		return destroySession(req, this.configService)
	}

	public async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string
	) {
		const newToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.DeactivateEmailSend(
			user.email,
			newToken.token,
			metadata
		)

		return true
	}

	public async deActivate(
		req: Request,
		input: DeactivateInput,
		user: User,
		userAgent: string
	) {
		const { email, password, pin } = input
		if (email !== user.email) {
			throw new BadGatewayException(
				'You can not deactivate another account.'
			)
		}

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) {
			throw new BadGatewayException('Invalid credentials.')
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent)
			return {
				message: 'Check your email and deactive account.'
			}
		}

		await this.validateDeactivateToken(req, pin)

		return { user }
	}
}
