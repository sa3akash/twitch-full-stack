/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChatService } from './chat.service'
import { ChangeSettingsInput } from './inputs/change-chat-settings.input'
import { SendMessageInput } from './inputs/send-message.input'
import { ChatMessageModel } from './models/chat-message.model'

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub

	public constructor(private readonly chatService: ChatService) {
		this.pubSub = new PubSub()
	}

	@Query(() => [ChatMessageModel], { name: 'findMessagesByStreamId' })
	public async findMessagesByStreamId(@Args('streamId') streamId: string) {
		return this.chatService.findMessagesByStream(streamId)
	}

	@Authorization()
	@Mutation(() => ChatMessageModel, { name: 'sendChatMessage' })
	public async sendChatMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput
	) {
		const message = await this.chatService.sendMessage(userId, input)
		await this.pubSub.publish('CHAT_MESSAGE_ADDED', {
			chatMessageAdded: message
		})
		return message
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	public async changeChatSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeSettingsInput
	) {
		return this.chatService.changeSettings(user, input)
	}

	@Subscription(() => ChatMessageModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamId === variables.streamId
	})
	public chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}
}
