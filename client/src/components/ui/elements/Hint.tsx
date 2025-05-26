import type { PropsWithChildren } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../common/tooltip'


interface HintProps {
	label: string
	asChild?: boolean
	side?: 'top' | 'bottom' | 'left' | 'right'
	align?: 'start' | 'center' | 'end'
    sideOffset?:number
}

export function Hint({
	children,
	label,
	asChild,
	align,
	side,
    sideOffset
}: PropsWithChildren<HintProps>) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent
					className='bg-[#1f2128] text-white dark:bg-white dark:text-[#1f2128]'
					side={side}
					align={align}
                    sideOffset={sideOffset}
				>
					<p className='font-semibold'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}