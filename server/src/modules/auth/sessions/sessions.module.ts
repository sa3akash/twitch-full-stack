import { Module } from '@nestjs/common'

import { VerificationService } from '../verification/verification.service'

import { SessionsResolver } from './sessions.resolver'
import { SessionsService } from './sessions.service'

@Module({
	providers: [SessionsResolver, SessionsService, VerificationService]
})
export class SessionsModule {}
