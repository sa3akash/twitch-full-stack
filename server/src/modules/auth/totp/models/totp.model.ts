import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TOTPModel {
	@Field(() => String)
	public secret: string

	@Field(() => String)
	public qrcodeUrl: string
}
