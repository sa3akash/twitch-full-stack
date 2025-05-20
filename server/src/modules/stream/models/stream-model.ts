import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Stream } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String, { nullable: true })
	public thumbnailUrl: string

	@Field(() => String, { nullable: true })
	public ingressId: string

	@Field(() => String, { nullable: true })
	public serverUrl: string

	@Field(() => String, { nullable: true })
	public streamKey: string

	@Field(() => Boolean)
	public isLive: boolean

	@Field(() => Boolean)
	public isChatEnabled: boolean

	@Field(() => Boolean)
	public isChatFollowersOnly: boolean

	@Field(() => Boolean)
	public isChatPremiumFollowersOnly: boolean

	@Field(() => String, { nullable: true })
	public userId: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String, { nullable: true })
	public categoryId: string

	@Field(() => CategoryModel)
	public category: CategoryModel

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
