import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class CategoryService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		return this.prismaService.category.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				streams: {
					include: {
						category: true,
						user: true
					}
				}
			}
		})
	}

	public async findRandom() {
		const count = await this.prismaService.category.count()

		if (count === 0) return []

		const limit = 8
		const maxOffset = Math.max(count - limit, 0)
		const randomOffset = Math.floor(Math.random() * (maxOffset + 1))

		return this.prismaService.category.findMany({
			skip: randomOffset,
			take: limit,
			include: {
				streams: {
					include: {
						category: true,
						user: true
					}
				}
			}
		})
	}

	public async findBySlug(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: { slug },
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		if (!category) {
			throw new BadRequestException('category not found.')
		}

		return category
	}
}
