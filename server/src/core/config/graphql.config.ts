import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { isDev } from '@/src/shared/utils/is-dev.util'

export function getGraphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd() + '/src/core/graphql/prisma.gql'),
		sortSchema: true,
		context: ({ req, res }: { req: Request; res: Response }) => ({
			req,
			res
		}),
		installSubscriptionHandlers: true,
		introspection: true
	}
}
