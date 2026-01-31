import React, { useState, useRef, useEffect } from 'react';
import './ChatPane.css';
import { Message } from '../../types';
import logo from '../../assets/logo.png';

interface ChatPaneProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatPane: React.FC<ChatPaneProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="chat-pane">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <img src={logo} alt="MERIDIAN" className="welcome-logo" />
            <h2>Welcome to MERIDIAN</h2>
            <p>Ask me complex questions that span multiple data sources.</p>
            <div className="example-queries">
              <p className="example-label">Try asking:</p>
              <button onClick={() => setInput('Who is the best developer to lead the authentication project?')}>
                "Who is the best developer to lead the authentication project?"
              </button>
              <button onClick={() => setInput('Show me candidates with React experience and good interview feedback')}>
                "Show me candidates with React experience and good feedback"
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
              {msg.metadata?.sources && (
                <div className="message-sources">
                  Sources: {msg.metadata.sources.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question across your data sources..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPane;
