import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryService } from './category.service'
import { CategoryModel } from './models/category.model'

@Resolver('Category')
export class CategoryResolver {
	public constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	public async findAllCategory() {
		return this.categoryService.findAll()
	}

	@Query(() => [CategoryModel], { name: 'findRandomCategory' })
	public async findRandomCategory() {
		return this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategoryBySlug' })
	public async findCategoryBySlug(@Args('slug') slug: string) {
		return this.categoryService.findBySlug(slug)
	}
}
