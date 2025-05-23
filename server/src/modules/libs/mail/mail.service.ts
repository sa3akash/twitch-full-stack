/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { type SessionMetadata } from '@/src/shared/types/session-metadata.types'

import { AccountDeletionTemplate } from './templates/account-deletions.template'
import { DeactivateTemplate } from './templates/deactivate.template'
import { EnableTwoFactorTemplate } from './templates/enable-two-factor.template'
import { PasswordRecoveryTemplate } from './templates/password-recovery.template'
import { VerificationTemplate } from './templates/verification.template'
import { VerifyChannelTemplate } from './templates/verify-channel.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}

	/**
	 *
	 * @param email
	 * @param token
	 * @work send verification email
	 */
	public async sendVerificationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(VerificationTemplate({ domain, token }))

		return this.sendMail(email, 'Account Verification', html)
	}

	/**
	 *
	 * @param email
	 * @param token
	 * @param metadata
	 * @returns Send password recovery email to user
	 */

	public async sendPasswordRecoveryEmail(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata })
		)

		return this.sendMail(email, 'Password Reset', html)
	}

	/**
	 *
	 * @param email
	 * @param token
	 * @param metadata
	 * @returns Send deactive email to user
	 */

	public async DeactivateEmailSend(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const html = await render(DeactivateTemplate({ token, metadata }))

		return this.sendMail(email, 'Account Deactivation', html)
	}

	/**
	 *
	 * @param email
	 * @param token
	 * @param metadata
	 * @returns Send account deletion email to user
	 */
	public async sendAccountDeletionEmail(email: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(AccountDeletionTemplate({ domain }))

		return this.sendMail(email, 'Your account has been deleted', html)
	}

	public async sendEnableTwoFactor(email: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(EnableTwoFactorTemplate({ domain }))

		return this.sendMail(email, 'Secure Your Account', html)
	}

	public async sendVerifyChannel(email: string) {
		const html = await render(VerifyChannelTemplate())

		return this.sendMail(email, 'Your Channel is Verified', html)
	}
}
