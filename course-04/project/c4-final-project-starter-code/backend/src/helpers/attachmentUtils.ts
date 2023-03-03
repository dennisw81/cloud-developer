import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('TodosAccess')

// TODO: Implement the fileStogare logic
export async function generateUploadUrl(
    todoId: string, 
    jwtToken: string
  ): Promise<string> {
    logger.info('Processing event: ', todoId, jwtToken)
    const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: +urlExpiration
      })
    return await signedUrl
  }