import { Injectable } from '@nestjs/common'

import {
	NotificationType,
	SponsorshipPlan,
	TokenType,
	type User
} from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.utils'

import { ChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input'

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnReadCount(user: User) {
		return this.prismaService.notification.count({
			where: { isRead: false, userId: user.id }
		})
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: { isRead: false, userId: user.id },
			data: { isRead: true }
		})

		return this.prismaService.notification.findMany({
			where: { userId: user.id },
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationsSettingsInput
	) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id
						}
					}
				},
				update: {
					siteNotifications,
					telegramNotifications
				},
				include: {
					user: true
				}
			})

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			)

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token
			}
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					telegramId: null
				}
			})

			return { notificationSettings }
		}

		return { notificationSettings }
	}

	public async createStreamStart(userId: string, channel: User) {
		return this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Don't Miss It!</b>
            <p>Join the stream on channel <a href='/${channel.username}' className='font-semibold'>${channel.displayName}</a>.</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have a new follower!</b>
            <p>This user <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a>.</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		return this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have a new sponsor!</b>
            <p>User <a href='/${sponsor.username}' className='font-semibold'>${sponsor.displayName}</a> has become your sponsor, choosing the <strong>${plan.title}</strong> plan.</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	public async createEnableTwoFactor(userId: string) {
		return this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Enhance your security!</b>
            <p>Enable two-factor authentication in your account settings to increase protection.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				userId
			}
		})
	}
}
