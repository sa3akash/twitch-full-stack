import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLUpload, Upload } from 'graphql-upload-ts'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filters.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token'
import { GenerateTokenStreamModel } from './models/generate-token.model'
import { StreamModel } from './models/stream-model'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	public constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStream' })
	public async findAllStream(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandomStreams() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeStreamInfo(
		@Authorized() user: User,
		@Args('data')
		input: ChangeStreamInfoInput
	) {
		return this.streamService.changeStreamInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateTokenStreamModel, { name: 'generateStreamToken' })
	public async generateStreamToken(
		@Args('data') input: GenerateStreamTokenInput
	) {
		return this.streamService.generateToken(input)
	}
}
