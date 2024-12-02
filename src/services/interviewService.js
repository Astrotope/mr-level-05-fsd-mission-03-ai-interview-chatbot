/**
 * Starts a new interview session with initial question
 * @param {Object} input - The input object containing jobTitle
 * @param {string} input.jobTitle - The position being applied for
 * @returns {Object} Interview session data including question and chat history
 */
function startInterview(input) {
    // console.log(input);
    const jobTitle = input;
    // console.log(jobTitle);

    if (!jobTitle) {
        throw new Error('Job title is required');
    }

    const question = "Tell me about yourself.";

    return {
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
    };
}

// Export the function for testing
module.exports = { startInterview };
