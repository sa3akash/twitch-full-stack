import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import type { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'
import { TelegramService } from '../../libs/telegram/telegram.service'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/password-recovery.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly telegramService: TelegramService
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgnet: string
	) {
		const user = await this.prismaService.user.findUnique({
			where: { email: input.email }
		})

		if (!user) throw new NotFoundException('User not found.')

		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET
		)

		const metadata = getSessionMetadata(req, userAgnet)

		await this.mailService.sendPasswordRecoveryEmail(
			user.email,
			resetToken.token,
			metadata
		)

		if (
			resetToken.user?.notificationSettings?.telegramNotifications &&
			resetToken.user.telegramId
		) {
			await this.telegramService.sendPasswordResetToken(
				resetToken.user.telegramId,
				resetToken.token,
				metadata
			)
		}

		return true
	}

	public async newPassword(input: NewPasswordInput) {
		const existToken = await this.prismaService.token.findUnique({
			where: { token: input.token, type: TokenType.PASSWORD_RESET }
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
				password: await hash(input.password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}
}
