# Setup

Node version v16.14.2

To install:

> npm i

To run tests

> npm t

# Deployment

It's possible to deploy to the lambda to AWS using `serverless`

Assuming `serverless` is installed globally

> npm i -g serverless

To deploy the lambda to AWS run

> serverless deploy

# Discussion

There's only one handler called `upload` that would parse a multipart form data and store the content in a s3 bucket.

Also, there's one unit test that mock AWS.

## Things to improve

Given the time constraint:

### There's no validation (swagger/json validation)

Input validation is important, it's could be done in the lambda either ad-hoc (checking for variables) or using a json schema.

Alternatively it could be possible to have the Gateway to valida the input parameters

### There's use of magic constant such as the bucket name hardcoded in the lambda

At the moment the only constant is hard-coded. In theory we should have that in SSM or something similar.

### There's a limitation on the file size by using this approach

I was reading there's 10Mb limitaion when we upload file to S3. To support larger file it would required the implementation of a signed request

### There's no integration test

Although I've tested it manually using postman there is no integragion test done. It should be however possible to implement it using axios and calling a real endpoint in AWS

## Comments

Just to be sure the code would work I decided to deploy something quick and easy to AWS, and that's why there's a `serverless.yml` file. I've tested with postman but as mentioned there's no integration tests done. Choosing the right multipart parser was somehow tricky.

A surprisingly difficult task was instead mocking the AWS libraries with jest. There are several options and I frankly struggled to make sense of the amount of information found. There are probably easier way!
