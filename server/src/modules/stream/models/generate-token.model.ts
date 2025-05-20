import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenerateTokenStreamModel {
	@Field(() => String)
	public token: string
}
