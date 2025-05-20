import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class ChangeSettingsInput {
	@Field(() => Boolean)
	@IsBoolean()
	public isChatEnabled: boolean

	@Field(() => Boolean)
	@IsBoolean()
	public isChatFollowersOnly: boolean

	@Field(() => Boolean)
	@IsBoolean()
	public isChatPremiumFollowersOnly: boolean
}
