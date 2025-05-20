import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class FiltersInput {
	@Field(() => Number, { nullable: true })
	@IsOptional()
	@IsNumber()
	public take?: number

	@Field(() => Number, { nullable: true })
	@IsOptional()
	@IsNumber()
	public skip?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	public searchTerm: string
}
