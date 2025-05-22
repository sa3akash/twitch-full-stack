import { SponsorshipPlan, User } from '@/prisma/generated'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome:
		`<b>👋 Welcome to the SA2Stream Bot!</b>\n\n` +
		`To receive notifications and enhance your platform experience, let's link your Telegram account with SA2Stream.\n\n` +
		`Click the button below and go to the <b>Notifications</b> section to complete the setup.`,
	authSuccess: `🎉 You have successfully logged in and your Telegram account is linked with SA2Stream!\n\n`,
	invalidToken: '❌ Invalid or expired token.',
	profile: (user: User, followersCount: number) =>
		`<b>👤 User Profile:</b>\n\n` +
		`👤 Username: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Number of followers: <b>${followersCount}</b>\n` +
		`📝 Bio: <b>${user.bio || 'Not specified'}</b>\n\n` +
		`🔧 Click the button below to access profile settings.`,
	follows: (user: User) =>
		`📺 <a href="https://sa2stream.com/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Password Reset</b>\n\n` +
		`You requested a password reset for your SA2Stream account.\n\n` +
		`To create a new password, please follow this link:\n\n` +
		`<b><a href="https://sa2stream.com/account/recovery/${token}">Reset Password</a></b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Info:</b>\n\n` +
		`🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Device OS:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`If you did not make this request, simply ignore this message.\n\n` +
		`Thank you for using <b>SA2Stream</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Account Deactivation Request</b>\n\n` +
		`You initiated the process to deactivate your SA2Stream account.\n\n` +
		`To complete the process, please confirm your request by entering the following verification code:\n\n` +
		`<b>Verification Code: ${token}</b>\n\n` +
		`📅 <b>Request Date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Request Info:</b>\n\n` +
		`• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`• 📱 <b>Device OS:</b> ${metadata.device.os}\n` +
		`• 🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`• 💻 <b>IP Address:</b> ${metadata.ip}\n\n` +
		`<b>What happens after deactivation?</b>\n\n` +
		`1. You will automatically log out and lose access to your account.\n` +
		`2. If you do not cancel within 7 days, your account will be <b>irretrievably deleted</b> with all your data and subscriptions.\n\n` +
		`<b>⏳ Note:</b> If you change your mind within 7 days, you can contact our support to restore access before complete deletion.\n\n` +
		`After deletion, account recovery is impossible, and all data will be lost.\n\n` +
		`If you changed your mind, simply ignore this message. Your account will remain active.\n\n` +
		`Thank you for using <b>SA2Stream</b>! We are always happy to see you on our platform and hope you stay with us. 🚀\n\n` +
		`Best regards,\n` +
		`The SA2Stream Team`,
	accountDeleted:
		`<b>⚠️ Your account has been permanently deleted.</b>\n\n` +
		`Your account has been completely erased from the SA2Stream database. All your data and information have been permanently removed. ❌\n\n` +
		`🔒 You will no longer receive notifications via Telegram or email.\n\n` +
		`If you want to return to the platform, you can register at the following link:\n` +
		`<b><a href="https://sa2stream.com/account/create">Register on SA2Stream</a></b>\n\n` +
		`Thank you for being with us! We will always be happy to see you on the platform. 🚀\n\n` +
		`Best regards,\n` +
		`The SA2Stream Team`,
	streamStart: (channel: User) =>
		`<b>📡 Streaming has started on channel ${channel.displayName}!</b>\n\n` +
		`Watch here: <a href="https://sa2stream.com/${channel.username}">Go to the stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>New Follower!</b>\n\n` +
		`This user <a href="https://sa2stream.com/${follower.username}">${follower.displayName}</a> is now following you.\n\n` +
		`Total followers on your channel: ${followersCount}`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 New Sponsor!</b>\n\n` +
		`You received a new sponsorship for the plan <b>${plan.title}</b>.\n` +
		`💰 Amount: <b>${plan.price} ₽</b>\n` +
		`👤 Sponsor: <a href="https://sa2stream.com/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Sponsorship Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>`,
	enableTwoFactor:
		`🔐 Ensure your security!\n\n` +
		`Enable two-factor authentication in <a href="https://sa2stream.com/dashboard/settings">your account settings</a>.`,
	verifyChannel:
		`<b>🎉 Congratulations! Your channel has been verified</b>\n\n` +
		`We are pleased to inform you that your channel is now verified, and you have received the official badge.\n\n` +
		`The verification badge confirms the authenticity of your channel and improves viewer trust.\n\n` +
		`Thank you for being with us and continuing to grow your channel with SA2Stream!`
}
