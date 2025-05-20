import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Upload } from 'graphql-upload-ts'
import { AccessToken } from 'livekit-server-sdk'
import * as sharp from 'sharp'

import { Prisma, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../libs/storage/storage.service'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filters.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService
	) {}

	public async changeThumbnail(user: User, uploadFile: Upload) {
		const file = uploadFile.file

		if (!file) {
			throw new BadRequestException('Thumbnail file not exist.')
		}

		const stream = await this.findByUserId(user.id)

		if (stream?.thumbnailUrl) {
			await this.storageService.remove(stream?.thumbnailUrl)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk as Buffer)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/streams/${user.username}.webp`

		if (file.filename && file.filename.endsWith('.gif')) {
			const processBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
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

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				thumbnailUrl: fileName
			}
		})

		return true
	}

	public async removeThumbnail(user: User) {
		if (!user.avatar) {
			return
		}

		const stream = await this.findByUserId(user.id)

		if (stream?.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: null }
		})

		return true
	}

	public async findAll(input: FiltersInput) {
		const { searchTerm, skip, take } = input

		const whireClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined

		return this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false
				},
				...whireClause
			},
			include: {
				user: true,
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	public async findRandom() {
		const count = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		})

		if (count === 0) return []

		const limit = 4
		const maxOffset = Math.max(count - limit, 0)
		const randomOffset = Math.floor(Math.random() * (maxOffset + 1))

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: { user: true, category: true },
			skip: randomOffset,
			take: limit
		})

		return streams
	}

	public async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				title: input.title,
				category: {
					connect: {
						id: input.categoryId
					}
				}
			}
		})
		return true
	}

	public async generateToken(input: GenerateStreamTokenInput) {
		const { channelId, userId } = input

		let self: { id: string; username: string }

		const user = await this.prismaService.user.findUnique({
			where: { id: userId }
		})

		if (user) {
			self = {
				id: user.id,
				username: user.username
			}
		} else {
			self = {
				id: userId,
				username: `Stream token ${Math.floor(Math.random() * 100000)}`
			}
		}

		const channel = await this.prismaService.user.findUnique({
			where: { id: channelId }
		})

		if (!channel) {
			throw new NotFoundException('Channel not found.')
		}

		const isHost = self.id === channel.id

		const token = new AccessToken(
			this.configService.getOrThrow('LIVEKIT_API_KEY'),
			this.configService.getOrThrow('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : self.id.toString(),
				name: self.username
			}
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		})

		return {
			token: await token.toJwt()
		}
	}

	private async findByUserId(userId: string) {
		return this.prismaService.stream.findUnique({
			where: { userId }
		})
	}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					user: {
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					category: {
						title: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		}
	}
}
