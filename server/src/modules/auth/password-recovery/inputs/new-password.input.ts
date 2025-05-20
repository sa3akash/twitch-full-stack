import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordMatchConstraint } from '@/src/shared/decorators/is-password-match'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	public password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@Validate(IsPasswordMatchConstraint)
	public passwordRepeat: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	public token: string
}
