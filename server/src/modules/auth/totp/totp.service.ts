import { BadRequestException, Injectable } from '@nestjs/common'
// import { encode } from 'hi-base32';
// import { randomBytes } from 'node:crypto';
import * as OTPAuth from 'otpauth'
import * as QRCode from 'qrcode'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { TOTPInput } from './inputs/totp.input'

@Injectable()
export class TotpService {
	public constructor(private readonly prismaService: PrismaService) {}

	public generate(user: User) {
		// const secret = encode(randomBytes(15)).replace(/=/g,'').substring(0,14)
		const secret = new OTPAuth.Secret().base32

		const totp = new OTPAuth.TOTP({
			issuer: 'SA2 Auth',
			label: `${user.email}`,
			algorithm: 'SHA1',
			period: 30,
			digits: 6,
			secret
		})

		const otpauthUrl = totp.toString()
		const qrcodeUrl = QRCode.toDataURL(otpauthUrl)

		return {
			secret,
			qrcodeUrl
		}
	}

	public async enable(user: User, input: TOTPInput) {
		const totp = new OTPAuth.TOTP({
			issuer: 'SA2 Auth',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret: input.secret
		})

		const delta = totp.validate({ token: input.pin })

		if (delta === null) {
			throw new BadRequestException('Invalid pin code.')
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				isTotpEnabled: true,
				totpSecret: input.secret
			}
		})

		return true
	}

	public async disable(user: User) {
		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				isTotpEnabled: false,
				totpSecret: null
			}
		})

		return true
	}
}
