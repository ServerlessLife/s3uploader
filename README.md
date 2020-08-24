# S3 file uploader

Minimalistic serverless S3 file uploader. It contains the bare minimum to achieve its purpose. 

It also includes a simple front-end client. No front-end libraries, like AWS SDK for file upload or Amplify for authentication, were used to make it as efficient as possible.

The process of file uploading:
1) The client authenticates to Congitio and acquires Id token.
2) Using ID token the client sends a request to Lambda function to get presigned URL that allows uploading to S3 for 5 minutes.
3) Upload to S3.

Front-end is automatically uploaded to an additional S3 bucket for static site hosting.

The project was build with Serverless Framework [Serverless Framework](https://www.serverless.com/) with additional plugins:
  * **serverless-s3-sync** Upload front-ent to S3 as static side.  
  * **serverless-webpack** For transpiling TypeScript and bundiling.
  * **serverless-iam-roles-per-function** Seperate permissions per function.
  * **serverless-stack-output** Outputs deployment like Lambda location and Cognito Client ID parameters for front-end.

## Installation

```bash
npm i
```

## Deployment to the development environment
```bash
npm run deploy-dev
```

## Deployment to the production environment
```bash
npm run deploy-prod
```

## Posible future improvments

 - Use S3 SDK for file upload to take advantage of multipart upload.
 - Implement whole user register and login flow, possibly with Amplify.