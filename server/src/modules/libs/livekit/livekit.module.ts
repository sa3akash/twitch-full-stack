import { type DynamicModule, Module } from '@nestjs/common'

import { LivekitService } from './livekit.service'
import {
	LiveKitOptionsSybol,
	type TypeLiveKitAsyncOptions,
	type TypeLiveKitOptions
} from './types/livekit.types'

@Module({})
export class LivekitModule {
	public static regiter(options: TypeLiveKitOptions): DynamicModule {
		return {
			module: LivekitModule,
			providers: [
				{
					provide: LiveKitOptionsSybol,
					useValue: options
				},
				LivekitService
			],
			exports: [LivekitService],
			global: true
		}
	}

	public static registerAsync(
		options: TypeLiveKitAsyncOptions
	): DynamicModule {
		return {
			module: LivekitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LiveKitOptionsSybol,
					useFactory: options.useFactory,
					inject: options.inject || []
				},
				LivekitService
			],
			exports: [LivekitService],
			global: true
		}
	}
}
