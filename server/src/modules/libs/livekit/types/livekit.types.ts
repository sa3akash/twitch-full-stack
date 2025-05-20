import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const LiveKitOptionsSybol = Symbol('LiveKitOptionsSybol')

export type TypeLiveKitOptions = {
	apiUrl: string
	apiKey: string
	apiSecret: string
}

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeLiveKitOptions>, 'useFactory' | 'inject'>
