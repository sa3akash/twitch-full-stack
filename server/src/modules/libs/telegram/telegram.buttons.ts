import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📜 My Subscriptions', 'follows'),
			Markup.button.callback('👤 View Profile', 'me')
		],
		[Markup.button.url('🌐 Visit Website', 'https://sa2stream.com')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Account Settings',
			'https://sa2stream.com/dashboard/settings'
		)
	])
}
