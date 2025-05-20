import { Module } from '@nestjs/common'

import { PasswordRecoveryResolver } from './password-recovery.resolver'
import { PasswordRecoveryService } from './password-recovery.service'
import { TelegramService } from '../../libs/telegram/telegram.service'

@Module({
	providers: [PasswordRecoveryResolver, PasswordRecoveryService, TelegramService]
})
export class PasswordRecoveryModule {}
