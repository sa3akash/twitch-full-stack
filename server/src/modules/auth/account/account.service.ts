import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import { hash, verify } from 'argon2'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { VerificationService } from '../verification/verification.service'

import { ChangeEmailInput } from './inputs/change-email.input'
import { ChangePasswordInput } from './inputs/change-password.input'
import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	public constructor(
		public readonly prismaService: PrismaService,
		public readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				socialLinks: true
			}
		})

		return user
	}

	public async createUser(input: CreateUserInput) {
		const isUserNameExist = await this.prismaService.user.findUnique({
			where: {
				username: input.username
			}
		})

		if (isUserNameExist)
			throw new ConflictException('Username already exist.')

		const isEmailExist = await this.prismaService.user.findUnique({
			where: {
				email: input.email
			}
		})

		if (isEmailExist) throw new ConflictException('Email already exist.')

		const user = await this.prismaService.user.create({
			data: {
				email: input.email,
				username: input.username,
				displayName: input.username,
				password: await hash(input.password),
				stream: {
					create: {
						title: `Stream ${input.username}`
					}
				}
			}
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}

	public async changeEmail(user: User, input: ChangeEmailInput) {
		if (user.email === input.email) {
			throw new BadRequestException('You can use new email address.')
		}

		const alreadyUse = await this.prismaService.user.findUnique({
			where: { email: input.email }
		})

		if (alreadyUse) throw new ConflictException('Email already in use.')

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { email: input.email }
		})

		return true
	}

	public async changePassword(user: User, input: ChangePasswordInput) {
		const verifyPassword = await verify(user.password, input.oldPassword)

		if (!verifyPassword) {
			throw new BadRequestException('Invalid password.')
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { password: await hash(input.newPassword) }
		})

		return true
	}
}
