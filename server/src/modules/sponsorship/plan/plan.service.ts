import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StripeService } from '../../libs/stripe/stripe.service'

import { CreatePlanInput } from './inputs/create-plan.input'

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	public async findMyPlans(user: User) {
		return this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id
			}
		})
	}

	public async create(user: User, input: CreatePlanInput) {
		const { price, title, description } = input

		const channelId = await this.prismaService.user.findUnique({
			where: { id: user.id }
		})

		if (!channelId) {
			throw new ForbiddenException(
				'Creating plans is available only in verified channels.'
			)
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'USD',
			interval: 'month',
			product: {
				name: title
			}
		})

		const stripeProductId = stripePlan.product as string

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: `${stripeProductId}`,
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	public async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			}
		})

		if (!plan) {
			throw new NotFoundException('plan not found.')
		}

		await this.stripeService.plans.del(plan.stripePlanId)
		await this.stripeService.products.del(plan.stripeProductId)

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id
			}
		})

		return true
	}
}
