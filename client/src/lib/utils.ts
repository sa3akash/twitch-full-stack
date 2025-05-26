import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MEDIA_URL } from "./constants/url.constants"
import { NotificationType } from "@/graphql/generated/output"
import { Bell, Check, Fingerprint, Medal, Radio, User } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getMediaSource(path: string | undefined | null) {
	return MEDIA_URL + path
}


export function getNotificationIcon(type: NotificationType) {
	switch (type) {
		case NotificationType.StreamStart:
			return Radio
		case NotificationType.NewFollower:
			return User
		case NotificationType.NewSponsorship:
			return Medal
		case NotificationType.EnableTwoFactor:
			return Fingerprint
		case NotificationType.VerifiedChannel:
			return Check
		default:
			return Bell
	}
}