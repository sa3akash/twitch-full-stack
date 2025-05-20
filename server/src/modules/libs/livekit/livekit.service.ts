import { Inject, Injectable } from '@nestjs/common'
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver
} from 'livekit-server-sdk'

import { LiveKitOptionsSybol, TypeLiveKitOptions } from './types/livekit.types'

@Injectable()
export class LivekitService extends IngressClient {
	private roomService: RoomServiceClient
	private ingressClient: IngressClient
	private webhookReceiver: WebhookReceiver

	public constructor(
		@Inject(LiveKitOptionsSybol)
		private readonly options: TypeLiveKitOptions
	) {
		super(options.apiUrl, options.apiKey, options.apiSecret) // Call super() first

		this.roomService = new RoomServiceClient(
			options.apiUrl,
			options.apiKey,
			options.apiSecret
		)
		this.ingressClient = new IngressClient(options.apiUrl)
		this.webhookReceiver = new WebhookReceiver(
			options.apiKey,
			options.apiSecret
		)
	}

	public get ingress(): IngressClient {
		return this.createProxy(this.ingressClient)
	}

	public get room(): RoomServiceClient {
		return this.createProxy(this.roomService)
	}

	public get receiver(): WebhookReceiver {
		return this.createProxy(this.webhookReceiver)
	}

	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (obj, prop) => {
				const value = obj[prop as keyof T]

				if (typeof value === 'function') {
					return value.bind(obj)
				}
				return value
			}
		})
	}
}
