import React from 'react';
import './App.css';
import ChatPane from './components/ChatPane/ChatPane';
import ContextSidebar from './components/ContextSidebar/ContextSidebar';
import ResultsViewer from './components/ResultsViewer/ResultsViewer';
import Aurora from './components/Aurora';
import { useChat } from './hooks/useChat';
import logo from './assets/logo.png';

function App() {
  const { 
    messages, 
    recommendations, 
    sources,
    sendMessage, 
    isLoading 
  } = useChat();

  return (
    <div className="app">
      <div className="aurora-background">
        <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      <header className="app-header">
        <div className="logo">
          <img src={logo} alt="MERIDIAN Logo" className="logo-image" />
          <h1>MERIDIAN</h1>
        </div>
        <p className="tagline">Multi-Source AI Decision Assistant</p>
      </header>
      
      <main className="app-main">
        <ContextSidebar sources={sources} />
        
        <div className="chat-container">
          <ChatPane 
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
        
        <ResultsViewer recommendations={recommendations} />
      </main>
    </div>
  );
}

export default App;
