import {
	BadRequestException,
	Injectable,
	type PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'node:fs'

import { validateFileFormat, validateFileSize } from '../utils/file.utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any) {
		const { filename, createReadStream } = value

		if (!filename) {
			throw new BadRequestException('File not uploaded')
		}

		const fileStream = createReadStream() as ReadStream
		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(
			filename as string,
			allowedFormats
		)

		if (!isFileFormatValid) {
			throw new BadRequestException('Unsupported file format')
		}

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024 // 10 MB
		)

		if (!isFileSizeValid) {
			throw new BadRequestException('File size exceeds 10 MB')
		}

		return value
	}
}
