import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import type { Upload } from 'graphql-upload-ts'
import * as sharp from 'sharp'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../../libs/storage/storage.service'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async changeAvater(user: User, uploadFile: Upload) {
		const file = uploadFile.file

		if (!file) {
			throw new BadRequestException('avater file not exist.')
		}

		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk as Buffer)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.username}.webp`

		if (file.filename && file.filename.endsWith('.gif')) {
			const processBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processBuffer = await sharp(buffer)
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processBuffer,
				fileName,
				'image/webp'
			)
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				avatar: fileName
			}
		})

		return true
	}

	public async removeAvater(user: User) {
		if (!user.avatar) {
			return
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: null }
		})

		return true
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { displayName, username, bio } = input

		const usernameExist = await this.prismaService.user.findUnique({
			where: { username }
		})

		if (usernameExist && username !== user.username) {
			throw new ConflictException('Username already exist.')
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				username,
				displayName,
				bio
			}
		})

		return true
	}

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: { userId: user.id },
			orderBy: {
				position: 'desc'
			}
		})

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

		await this.prismaService.socialLink.create({
			data: {
				title: input.title,
				url: input.url,
				position: newPosition,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	public async reOrderSocialLink(inputList: SocialLinkOrderInput[]) {
		if (!inputList.length) return

		const updatePromises = inputList.map(item => {
			return this.prismaService.socialLink.update({
				where: { id: item.id },
				data: {
					position: item.position
				}
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		await this.prismaService.socialLink.update({
			where: { id },
			data: {
				title: input.title,
				url: input.url
			}
		})

		return true
	}

	public async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: { id }
		})

		return true
	}

	public async findSocialLinks(user: User) {
		return this.prismaService.socialLink.findMany({
			where: { userId: user.id },
			orderBy: { position: 'asc' }
		})
	}
}
