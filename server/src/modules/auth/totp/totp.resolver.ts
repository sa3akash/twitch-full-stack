import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { TOTPInput } from './inputs/totp.input'
import { TOTPModel } from './models/totp.model'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	public constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TOTPModel, { name: 'generateOtpSecret' })
	public generate(@Authorized() user: User) {
		return this.totpService.generate(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'enabledTotp' })
	public enabledTotp(
		@Authorized() user: User,
		@Args('data') input: TOTPInput
	) {
		return this.totpService.enable(user, input)
	}

	@Authorization()
	@Query(() => Boolean, { name: 'disabledTotp' })
	public disabledTotp(@Authorized() user: User) {
		return this.totpService.disable(user)
	}
}
