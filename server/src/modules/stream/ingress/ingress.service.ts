import { BadRequestException, Injectable } from '@nestjs/common'
import {
	CreateIngressOptions,
	IngressAudioEncodingPreset,
	IngressAudioOptions,
	IngressInput,
	IngressVideoEncodingPreset,
	IngressVideoOptions,
	TrackSource
} from 'livekit-server-sdk'

import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LivekitService } from '../../libs/livekit/livekit.service'

@Injectable()
export class IngressService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}

	public async create(user: User, ingressType: IngressInput) {
		await this.resetIngress(user)

		const options: CreateIngressOptions = {
			name: user.username,
			roomName: user.id,
			participantName: user.username,
			participantIdentity: user.id
		}

		if (ingressType === IngressInput.WHIP_INPUT) {
			options.enableTranscoding = true
		} else {
			options.video = new IngressVideoOptions({
				source: TrackSource.UNKNOWN,
				encodingOptions: {
					case: 'preset',
					value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
				}
			})

			options.audio = new IngressAudioOptions({
				source: TrackSource.UNKNOWN,
				encodingOptions: {
					case: 'preset',
					value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
				}
			})
		}

		const ingress = await this.livekitService.ingress.createIngress(
			ingressType,
			options
		)

		if (!ingress || !ingress.url || !ingress.streamKey) {
			throw new BadRequestException('Failed to create input stream')
		}

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				ingressId: ingress.ingressId,
				serverUrl: ingress.url,
				streamKey: ingress.streamKey
			}
		})

		return true
	}

	private async resetIngress(user: User) {
		const ingress = await this.livekitService.ingress.listIngress({
			roomName: user.id
		})

		const rooms = await this.livekitService.room.listRooms([user.id])

		for (const room of rooms) {
			await this.livekitService.room.deleteRoom(room.name)
		}

		for (const ingres of ingress) {
			if (ingres.ingressId) {
				await this.livekitService.ingress.deleteIngress(
					ingres.ingressId
				)
			}
		}
	}
}
