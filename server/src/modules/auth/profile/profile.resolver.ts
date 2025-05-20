import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLUpload, Upload } from 'graphql-upload-ts'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'
import { SocialLinkModel } from './models/social-link.model'
import { ProfileService } from './profile.service'

@Resolver('Profile')
export class ProfileResolver {
	public constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeAvater' })
	public async changeAvater(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
		avater: Upload
	) {
		return this.profileService.changeAvater(user, avater)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeAvater' })
	public async removeAvater(@Authorized() user: User) {
		return this.profileService.removeAvater(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileInfo' })
	public async changeProfileInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeProfileInfoInput
	) {
		return this.profileService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createSocialLink' })
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'reorderSocialLinkArray' })
	public async reorderSocialLinkArray(
		@Args('list', { type: () => [SocialLinkOrderInput] })
		list: SocialLinkOrderInput[]
	) {
		return this.profileService.reOrderSocialLink(list)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	public async updateSocialLink(
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.updateSocialLink(id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	public async removeSocialLink(@Args('id') id: string) {
		return this.profileService.removeSocialLink(id)
	}

	@Authorization()
	@Query(() => [SocialLinkModel], { name: 'getSocialLink' })
	public async getSocialLink(@Authorized() user: User) {
		return this.profileService.findSocialLinks(user)
	}
}
