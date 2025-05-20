import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public login: string

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
