import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import type { User } from '@/prisma/generated'

import { getSessionMetadata } from './session-metadata.util'

export function saveSession(req: Request, user: User, userAgent: string) {
	const metadata = getSessionMetadata(req, userAgent)

	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				return reject(
					new InternalServerErrorException('Internal server error.')
				)
			}
			resolve({ user })
		})
	})
}

export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(
					new InternalServerErrorException('Internal server error.')
				)
			}
			req.res?.clearCookie(
				configService.getOrThrow<string>('SESSION_NAME')
			)
			resolve(true)
		})
	})
}
