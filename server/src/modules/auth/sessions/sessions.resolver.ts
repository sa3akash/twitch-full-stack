import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { AuthModel } from '../account/models/auth.model'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionsService } from './sessions.service'

@Resolver('Sessions')
export class SessionsResolver {
	constructor(private readonly sessionsService: SessionsService) {}

	@Mutation(() => AuthModel, { name: 'login' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionsService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionsService.logout(req)
	}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionByUser' })
	public async findSessionByUser(@Context() { req }: GqlContext) {
		return this.sessionsService.findByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrentSession(@Context() { req }: GqlContext) {
		return this.sessionsService.findCurrent(req)
	}

	@Mutation(() => Boolean, { name: 'clearSessionsCookie' })
	public clearSession(@Context() { req }: GqlContext) {
		return this.sessionsService.clearSessions(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public async removeSession(
		@Context() { req }: GqlContext,
		@Args('id') id: string
	) {
		return this.sessionsService.remove(req, id)
	}
}
