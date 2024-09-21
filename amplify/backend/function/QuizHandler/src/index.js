/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { userName, score, answers } = requestBody;

        const id = Date.now().toString();
        const params = {
            TableName: 'QuizDB-dev', // Tên bảng DynamoDB của bạn
            Item: {
                id: id,
                userName: userName,
                score: score,
                answers: answers,
                timestamp: new Date().toISOString()
            }
        };
        await dynamo.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Quiz results submitted successfully',
                data: params.Item
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to submit quiz results',
                error: error.message,
            }),
        };
    }
};