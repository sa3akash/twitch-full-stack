import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { ChangeSettingsInput } from './inputs/change-chat-settings.input'
import { SendMessageInput } from './inputs/send-message.input'

@Injectable()
export class ChatService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findMessagesByStream(streamId: string) {
		return this.prismaService.chatMessage.findMany({
			where: { streamId },
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				user: true
			}
		})
	}

	public async sendMessage(userId: string, input: SendMessageInput) {
		const { text, streamId } = input

		const stream = await this.prismaService.stream.findUnique({
			where: { id: streamId }
		})

		if (!stream) {
			throw new NotFoundException('stream not found.')
		}
		if (!stream.isLive) {
			throw new BadRequestException('stream not live.')
		}

		const message = await this.prismaService.chatMessage.create({
			data: {
				text,
				user: {
					connect: {
						id: userId
					}
				},
				stream: {
					connect: {
						id: stream.id
					}
				}
			},
			include: {
				stream: true,
				user: true
			}
		})

		return message
	}

	public async changeSettings(user: User, input: ChangeSettingsInput) {
		const {
			isChatEnabled,
			isChatFollowersOnly,
			isChatPremiumFollowersOnly
		} = input

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumFollowersOnly
			}
		})

		return true
	}
}
