const { startInterview } = require('./interviewService');

jobTitle = "Full stack Developer"
question = "Tell me about yourself."

expectedResult = {
        jobTitle,
        question,
        history: [
            {
                role: "user",
                parts: [{ text: `I am applying for the ${jobTitle} position. Please start the interview with your first question.` }]
            },
            {
                role: "model",
                parts: [{ text: question }]
            }
        ]
    }

console.log(expectedResult);
console.log(expectedResult.jobTitle);

describe('startInterview() tests', () => {
  test('should return JSON object that matches expected result', () => {
    const result = startInterview(jobTitle);
    console.log(result, expectedResult);
    expect(result).toStrictEqual(expectedResult);
  });

});

