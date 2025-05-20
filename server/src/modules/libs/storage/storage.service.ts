import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'

@Injectable()
export class StorageService {
	private readonly client: Minio.Client
	private readonly bucket: string

	public constructor(private readonly configService: ConfigService) {
		this.client = new Minio.Client({
			endPoint:
				this.configService.getOrThrow('MINIO_ENDPOINT') || 'localhost',
			port: parseInt(
				this.configService.getOrThrow('MINIO_PORT') || '9000'
			),
			useSSL: this.configService.getOrThrow('MINIO_USE_SSL') === 'true',
			accessKey:
				this.configService.getOrThrow('MINIO_ACCESS_KEY') ||
				'minioadmin',
			secretKey:
				this.configService.getOrThrow('MINIO_SECRET_KEY') ||
				'minioadmin'
		})

		this.bucket = this.configService.getOrThrow('MINIO_BUCKET')

		void this.initialBucket()
	}

	public async upload(buffer: Buffer, key: string, mimetype: string) {
		const metaData: Minio.ItemBucketMetadata = {
			'Content-Type': mimetype
		}
		try {
			// await this.initialBucket()

			await this.client.putObject(
				this.bucket,
				key,
				buffer,
				buffer.length,
				metaData
			)
		} catch (error) {
			throw new error()
		}
	}

	public async remove(key: string) {
		try {
			await this.client.removeObject(this.bucket, key)
		} catch (error) {
			throw new error()
		}
	}

	private async initialBucket() {
		const bucketExists = await this.client.bucketExists(this.bucket)
		if (!bucketExists) {
			await this.client.makeBucket(this.bucket, 'us-east-1')
		}

		// const policy = {
		// 	Version: '2012-10-17',
		// 	Statement: [
		// 		{
		// 			Effect: 'Allow',
		// 			Principal: '*',
		// 			Action: ['s3:GetObject'],
		// 			Resource: ['arn:aws:s3:::sa2stream/*']
		// 		}
		// 	]
		// }

		// await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy))
	}
}
