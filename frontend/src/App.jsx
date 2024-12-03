import React, { useState } from 'react';
import { Container, Header, Button, Form, TextArea, Segment, Message } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:5567';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startInterview = async () => {
    if (!jobTitle) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle })
      });
      const data = await res.json();
      setChatHistory(data.history);
      setAnalysis(null);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
    setIsLoading(false);
  };

  const sendResponse = async () => {
    if (!response || !jobTitle) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          response,
          history: chatHistory
        })
      });
      const data = await res.json();
      setChatHistory(data.history);
      setResponse('');
    } catch (error) {
      console.error('Error sending response:', error);
    }
    setIsLoading(false);
  };

  const analyzeInterview = async () => {
    if (!jobTitle || chatHistory.length === 0) return;
    setIsLoading(true);
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/api/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          history: chatHistory
        })
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing interview:', error);
    }
    setIsLoading(false);
    // Keep isAnalyzing true so we can show the completion message
    setTimeout(() => setIsAnalyzing(false), 6000); // Reset after 6 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 p-16">
      <Container>
        <Segment raised padded="very" className="!px-12 !py-6 border border-gray-200 shadow-sm rounded-lg">
          <Header 
            as="h1" 
            className="font-sans text-3xl font-semibold mb-8 !pl-2 !pr-4 !py-3 rounded-md"
            color="blue"
            style={{ color: '#007FFF', padding: '0.75rem 1rem 0.75rem 0.5rem' }}
          >
            AI Practice Interview Assistant
          </Header>

          <Segment raised style={{ marginBottom: '1.5rem' }}>
            <Form>
              <Form.Field>
                <label>Job Title</label>
                <input
                  placeholder="Enter the job title..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && startInterview()}
                />
              </Form.Field>
              <Button 
                primary 
                size="large" 
                onClick={startInterview}
                disabled={isLoading || !jobTitle}
              >
                {chatHistory.length > 0 ? 'Re-start Interview' : 'Start Interview'}
              </Button>
            </Form>
          </Segment>

          {chatHistory.length > 0 && (
            <Segment raised style={{ marginBottom: '1.5rem' }}>
              {chatHistory.slice(1).map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    msg.role === 'model'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="font-semibold">
                    {msg.role === 'model' ? '[Interviewer] ' : '[Applicant] '}
                  </span>
                  {msg.parts[0].text}
                </div>
              ))}
            </Segment>
          )}

          <Segment raised style={{ marginBottom: '1.5rem' }}>
            <Form>
              <TextArea
                placeholder="Type your response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                style={{ minHeight: 100 }}
                disabled={!chatHistory.length || isLoading}
              />
            </Form>
          </Segment>

          <div className="flex justify-end space-x-4" style={{ marginBottom: '1.5rem' }}>
            <Button
              primary
              size="large"
              onClick={sendResponse}
              disabled={isLoading || !response || !chatHistory.length}
            >
              Send Response
            </Button>
            <Button
              primary
              size="large"
              onClick={analyzeInterview}
              disabled={isLoading || !chatHistory.length}
            >
              Analyse Interview
            </Button>
          </div>

          {isAnalyzing && (
            <Message
              info={!analysis}
              success={!!analysis}
              style={{ marginBottom: '1.5rem' }}
            >
              <Message.Header className="!font-light">
                <span className="!font-light">
                  {analysis 
                    ? "Thank you for waiting. I have completed your interview analysis. Here are the results..."
                    : "Please wait as I evaluate your interview performance. This will take a moment..."}
                </span>
              </Message.Header>
            </Message>
          )}

          {analysis && (
            <Segment raised style={{ marginBottom: '1.5rem' }}>
              <h3 className="text-xl font-semibold mb-4">Interview Analysis</h3>
              <div className="prose max-w-none">
                <ReactMarkdown 
                  className="text-gray-700"
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props} />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </Segment>
          )}
        </Segment>
      </Container>
    </div>
  );
}

export default App;