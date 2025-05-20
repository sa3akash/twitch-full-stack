import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length
} from 'class-validator'

@InputType()
export class DeactivateInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	public pin?: string
}
