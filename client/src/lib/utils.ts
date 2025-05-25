import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MEDIA_URL } from "./constants/url.constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getMediaSource(path: string | undefined | null) {
	return MEDIA_URL + path
}