# Quiz Application

[Link workshop notion](https://extreme-ketch-98c.notion.site/Serverless-Amplify-with-Api-Gateway-Lambda-Function-DynamoDB-06b3eca518104743b0c149bab7c7ed31?pvs=4)

## Overview

This project is a **Quiz Application** built with AWS Amplify, React, and several AWS services such as Lambda, API Gateway, DynamoDB, and Cognito. The app allows users to take quizzes, submit results, and stores these results in a secure, scalable database on DynamoDB.

## Key Features

- **User Authentication**: Managed by Amazon Cognito, allowing both authenticated and unauthenticated users to take quizzes.
- **Quiz Management**: Users can submit their quiz results, which are securely stored in DynamoDB.
- **Serverless Architecture**: Utilizes AWS Lambda functions to handle backend logic and API Gateway for routing.
- **Data Storage**: Quiz results are persisted in a DynamoDB table for quick and scalable access.

## Technologies Used

- **Frontend**: React
- **Backend**: AWS Lambda, API Gateway, DynamoDB
- **Authentication**: Amazon Cognito
- **Cloud Infrastructure**: AWS Amplify for deployment and resource management
