import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/common/Button'
import { cn } from '@/lib/utils'

export default async function NotFoundPage() {
	const t = await getTranslations('notFound')

	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<div className='px-4 py-10 text-center sm:px-6 lg:px-8'>
				<h1 className='block text-7xl font-bold text-foreground sm:text-9xl'>
					404
				</h1>
				<p className='mt-3 text-muted-foreground'>{t('description')}</p>
				<Link
					href='/'
					className={cn(buttonVariants({variant:'secondary'}),'mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3')}
				>
					{t('backToHome')}
				</Link>
			</div>
		</div>
	)
}