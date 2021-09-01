#!/bin/bash
aws ecr get-login-password | docker login --username AWS --password-stdin 598972566054.dkr.ecr.eu-central-1.amazonaws.com
docker build -t playwright-aws-lambda-example:latest .
docker tag playwright-aws-lambda-example:latest 598972566054.dkr.ecr.eu-central-1.amazonaws.com/playwright-aws-lambda-example:latest
echo pushingto aws
docker push 598972566054.dkr.ecr.eu-central-1.amazonaws.com/playwright-aws-lambda-example
echo updating lambda
aws lambda update-function-code --function-name firefoxtest --image-uri 598972566054.dkr.ecr.eu-central-1.amazonaws.com/playwright-aws-lambda-example:latest | xargs echo
echo waiting to activate function
aws lambda wait function-updated --function-name firefoxtest
echo invoke
aws lambda invoke --function-name firefoxtest out.txt --log-type Tail --query 'LogResult' --output text |  base64 -d
