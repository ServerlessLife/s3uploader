import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

var s3 = new S3();

export const uploadLinkHandler: APIGatewayProxyHandler = async (event, _context) => {
  let fileKey = uuidv4();
  let bucket = process.env.S3_IMAGE_BUCKET;
  
  let contentType: string;

  if (event.body) {
    contentType = JSON.parse(event.body)?.contentType;
  }

  //Get temporaty URL from S3 that has permissions to upload file
  var uploadURL = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucket,
    ContentType: contentType,
    Key: fileKey,
    Expires: 5000
  });

  return {
    statusCode: 200,
    headers: {
      //'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Origin': process.env.WEBSITE_URL,
      'Access-Control-Allow-Credentials': true,
    },
    body: uploadURL,
  };
}
