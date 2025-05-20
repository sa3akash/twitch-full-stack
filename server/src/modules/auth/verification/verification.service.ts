import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { saveSession } from '@/src/shared/utils/session.utils'

import { MailService } from '../../libs/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input
		const existToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.EMAIL_VERIFY }
		})

		if (!existToken) {
			throw new NotFoundException('Token not found.')
		}

		const hasExpired = new Date(existToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token expired.')
		}

		const updatedUser = await this.prismaService.user.update({
			where: { id: existToken.userId! },
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		return saveSession(req, updatedUser, userAgent)
	}

	public async sendVerificationToken(user: User) {
		const newToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY
		)

		await this.mailService.sendVerificationEmail(user.email, newToken.token)

		return true
	}
}
