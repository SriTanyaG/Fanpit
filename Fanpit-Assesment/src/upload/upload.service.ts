import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION')
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucket) {
      throw new Error('AWS_S3_BUCKET is not configured');
    }

    const key = `uploads/${uuidv4()}-${file.originalname}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(url: string): Promise<void> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucket) {
      throw new Error('AWS_S3_BUCKET is not configured');
    }

    const key = url.split('/').pop();
    if (!key) {
      throw new Error('Invalid image URL');
    }

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucket,
      Key: `uploads/${key}`
    };

    await this.s3.deleteObject(params).promise();
  }

  async deleteMultipleImages(urls: string[]): Promise<void> {
    const deletePromises = urls.map(url => this.deleteImage(url));
    await Promise.all(deletePromises);
  }
}
