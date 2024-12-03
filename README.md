# MR Level 05 - FSD - Mission 03 AI Interview Chatbot

## Project Admin
- [Daily Standups](admin/DAILY_STANDUP_LOG.md)

## Git & GitHub - Dev. Setup and Usage
- [Git & GitHub Notes](dev-notes/GIT_SETUP.md)

## What we are working on.

- [CM] serve.test.js, server.js, apiRoutes.test.js, apiRoutes.js, respond.js, analyse.js along with their .test.js files. ./services/interviewServices.js &  ./services/interviewServices.test.js 
- [CR]
- [JR]

## Running tests and the backend server

### Setup up .env

[.env is now in the root ./]
```text
GEMINI_API_KEY="YOUR_KEY"
GEMINI_MODEL_NAME="gemini-1.5-flash"

```

### Run tests using mocks for Google Gemini

[in root ./]
```bash
npm test
```

### Run tests using Google Gemini live

[in root ./ not ./src]
```bash
[mac/linux]
USE_REAL_AI=true npm test

[windows CMD]
set USE_REAL_AI=true && npm test

[windows PowerShell]
$env:USE_REAL_AI="true"; npm test
```

### Run the server

[in the root ./ not ./src]
```bash
npm start
```

### Sample JSON data for testing the endpoints

#### http://localhost:5567/api/start

```json
{
  "jobTitle": "Software Developer"
}
```

- Response (exact)

```json
{
    "jobTitle": "Software Developer",
    "question": "Tell me about yourself.",
    "history": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "I am applying for the Software Developer position. Please start the interview with your first question."
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "Tell me about yourself."
                }
            ]
        }
    ]
}
```

#### http://localhost:5567/api/respond

```json\
{
  "jobTitle": "Software Developer",
  "response": "I have 5 years of experience as a software developer, specializing in web development with JavaScript and Node.js. I've worked on several large-scale applications and enjoy solving complex problems.",
  "history": [
    {
      "role": "user",
      "parts": [{ "text": "I am applying for the Software Developer position. Please start the interview with your first question." }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Tell me about yourself." }]
    }
  ]
}

```

- Response (example)

```json
{
    "jobTitle": "Software Developer",
    "question": "Can you describe a particularly challenging problem you solved using Node.js, and what approaches you took?\n",
    "history": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "I am applying for the Software Developer position. Please start the interview with your first question."
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "Tell me about yourself."
                }
            ]
        },
        {
            "role": "user",
            "parts": [
                {
                    "text": "I have 5 years of experience as a software developer, specializing in web development with JavaScript and Node.js. I've worked on several large-scale applications and enjoy solving complex problems."
                }
            ]
        },
        {
            "role": "model",
            "parts": [
                {
                    "text": "Can you describe a particularly challenging problem you solved using Node.js, and what approaches you took?\n"
                }
            ]
        }
    ]
}

```

#### http://localhost:5567/api/analyse

```json
{
  "jobTitle": "Software Developer",
  "history": [
    {
      "role": "user",
      "parts": [{ "text": "I am applying for the Software Developer position. Please start the interview with your first question." }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Tell me about yourself." }]
    },
    {
      "role": "user",
      "parts": [{ "text": "I have 5 years of experience as a software developer, specializing in web development with JavaScript and Node.js. I've worked on several large-scale applications and enjoy solving complex problems." }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Can you describe a challenging technical problem you encountered in one of your large-scale applications and how you solved it?" }]
    },
    {
      "role": "user",
      "parts": [{ "text": "In my last project, we faced performance issues with our Node.js API handling high concurrent requests. I implemented caching strategies using Redis and restructured our database queries, which improved response times by 70%." }]
    }
  ]
}

```

- Response (example)

```json
{
    "analysis": "This is a very short interview snippet, but we can still glean some insights and provide feedback.\n\n**1. Technical Skills:** The candidate claims expertise in JavaScript, Node.js, and web development, and mentions experience with Redis and database optimization.  The description of solving performance issues is a good start, but lacks depth.  We don't know *what* database they used, the specifics of the caching strategy (e.g., what type of caching, invalidation strategy), or details about the database query restructuring.  The 70% improvement is impressive, but without specifics, it's hard to assess the true technical skill.  **Actionable feedback:**  The interviewer should probe deeper.  Instead of accepting the \"implemented caching strategies,\" the interviewer should ask for specifics: \"Can you elaborate on the caching strategy you implemented? What type of caching did you use (e.g., LRU, FIFO)? How did you handle cache invalidation? What were the performance metrics before and after the changes?\"  Similar probing is needed for the database query restructuring.  Questions about error handling and monitoring should also be included.\n\n\n**2. Problem-Solving:** The candidate presents a solution, but the explanation is high-level. The problem-solving approach is only partially visible. We don't know if they considered other solutions, how they debugged the problem, or how they measured the improvement.  **Actionable feedback:** The interviewer needs to ask about the candidate's debugging process, the tools used for performance monitoring and profiling (e.g., New Relic, Datadog), and alternative solutions considered (and why they were rejected).  A follow-up question like, \"What was your initial hypothesis about the cause of the performance bottleneck?\" would help assess their analytical skills.\n\n\n**3. Communication:** The candidate's communication is concise but lacks detail.  The response is functional but not compelling.  It lacks the storytelling aspect that makes technical explanations engaging.  **Actionable feedback:**  The candidate needs to practice structuring their answers using the STAR method (Situation, Task, Action, Result). This method provides a clear and structured way to present their experience.  They should also practice articulating technical details clearly and concisely, using appropriate terminology and avoiding vague statements like \"restructured our database queries.\"\n\n\n**4. Experience & Examples:** The candidate mentions a large-scale application, but doesn't elaborate on the scale (number of users, data volume, etc.) or the specific technologies used beyond Node.js and Redis.  The impact of their solution is presented quantitatively (70% improvement), which is good, but lacks qualitative details about the user experience improvement or business impact.  **Actionable feedback:** The candidate should quantify their accomplishments using metrics whenever possible (e.g., \"reduced latency from X ms to Y ms,\" \"increased throughput from Z requests per second to W requests per second\").  They should also focus on the impact of their work on users or the business.\n\n\n**5. Overall Assessment:** Based on this short exchange, the candidate demonstrates *some* technical skills, but a deeper dive is needed to assess their true expertise.  The problem-solving approach is partially visible but requires further exploration. Communication is adequate but needs improvement in detail and structure.  The impact of their experience needs further elaboration.  **Recommendation:**  The interview should continue with more probing technical questions, focusing on specifics and requiring detailed explanations.  The candidate needs to demonstrate a deeper understanding of the technologies used and a more structured approach to problem-solving.  A final decision should be deferred until a more comprehensive assessment is completed.\n"
}

```

- Response (example) as Markdown Code

```md
This is a very short interview snippet, but we can still glean some insights and provide feedback.

### 1. Technical Skills  
The candidate claims expertise in JavaScript, Node.js, and web development, and mentions experience with Redis and database optimization. The description of solving performance issues is a good start but lacks depth. We don't know *what* database they used, the specifics of the caching strategy (e.g., what type of caching, invalidation strategy), or details about the database query restructuring. The 70% improvement is impressive, but without specifics, it's hard to assess the true technical skill.  

**Actionable feedback:**  
The interviewer should probe deeper. Instead of accepting "implemented caching strategies," the interviewer should ask for specifics:  
- "Can you elaborate on the caching strategy you implemented?  
- What type of caching did you use (e.g., LRU, FIFO)?  
- How did you handle cache invalidation?  
- What were the performance metrics before and after the changes?"  

Similar probing is needed for the database query restructuring. Questions about error handling and monitoring should also be included.

---

### 2. Problem-Solving  
The candidate presents a solution, but the explanation is high-level. The problem-solving approach is only partially visible. We don't know if they considered other solutions, how they debugged the problem, or how they measured the improvement.  

**Actionable feedback:**  
The interviewer needs to ask about the candidate's debugging process, the tools used for performance monitoring and profiling (e.g., New Relic, Datadog), and alternative solutions considered (and why they were rejected). A follow-up question like:  
- "What was your initial hypothesis about the cause of the performance bottleneck?"  

...would help assess their analytical skills.

---

### 3. Communication  
The candidate's communication is concise but lacks detail. The response is functional but not compelling. It lacks the storytelling aspect that makes technical explanations engaging.  

**Actionable feedback:**  
The candidate needs to practice structuring their answers using the STAR method (Situation, Task, Action, Result). This method provides a clear and structured way to present their experience. They should also practice articulating technical details clearly and concisely, using appropriate terminology and avoiding vague statements like "restructured our database queries."

---

### 4. Experience & Examples  
The candidate mentions a large-scale application but doesn't elaborate on the scale (number of users, data volume, etc.) or the specific technologies used beyond Node.js and Redis. The impact of their solution is presented quantitatively (70% improvement), which is good, but lacks qualitative details about the user experience improvement or business impact.  

**Actionable feedback:**  
The candidate should quantify their accomplishments using metrics whenever possible:  
- "Reduced latency from X ms to Y ms."  
- "Increased throughput from Z requests per second to W requests per second."  

They should also focus on the impact of their work on users or the business.

---

### 5. Overall Assessment  
Based on this short exchange, the candidate demonstrates *some* technical skills, but a deeper dive is needed to assess their true expertise. The problem-solving approach is partially visible but requires further exploration. Communication is adequate but needs improvement in detail and structure. The impact of their experience needs further elaboration.  

**Recommendation:**  
The interview should continue with more probing technical questions, focusing on specifics and requiring detailed explanations. The candidate needs to demonstrate a deeper understanding of the technologies used and a more structured approach to problem-solving. A final decision should be deferred until a more comprehensive assessment is completed.


``

