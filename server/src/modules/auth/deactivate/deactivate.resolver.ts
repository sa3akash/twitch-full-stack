import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { AuthModel } from '../account/models/auth.model'

import { DeactivateService } from './deactivate.service'
import { DeactivateInput } from './inputs/deactivate-account.input'

@Resolver('Deactivate')
export class DeactivateResolver {
	public constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Query(() => Boolean, { name: 'sendDeactivateEmail' })
	public async sendDeactivateEmail(
		@Context() { req }: GqlContext,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.sendDeactivateToken(req, user, userAgent)
	}

	@Authorization()
	@Mutation(() => AuthModel, { name: 'deactivate' })
	public async deactivate(
		@Context() { req }: GqlContext,
		@Authorized() user: User,
		@UserAgent() userAgent: string,
		@Args('data') input: DeactivateInput
	) {
		return this.deactivateService.deActivate(req, input, user, userAgent)
	}
}
