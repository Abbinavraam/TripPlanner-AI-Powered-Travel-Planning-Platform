import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react';
import './TravelBuddyChat.css';

const TravelBuddyChat = ({ tripData = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI Travel Buddy 🌍 I'm here to help you plan the perfect trip! Ask me about destinations, activities, local tips, or anything travel-related!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateTravelPrompt = (userMessage) => {
    let contextInfo = '';
    if (tripData) {
      contextInfo = `
      Current trip context:
      - Destination: ${tripData.destination || 'Not specified'}
      - Dates: ${tripData.dates ? `${tripData.dates.start} to ${tripData.dates.end}` : 'Not specified'}
      - Travelers: ${tripData.participants || tripData.travelers || 'Not specified'}
      - Budget: ${tripData.budget || 'Not specified'}
      - Interests: ${tripData.interests ? tripData.interests.join(', ') : 'Not specified'}
      `;
    }

    return `You are an expert AI Travel Buddy assistant. You help users plan amazing trips with personalized recommendations.
    
    ${contextInfo}
    
    User question: ${userMessage}
    
    Please provide helpful, friendly, and specific travel advice. If the user is asking about their current trip context, use that information. Keep responses conversational and engaging, like a knowledgeable travel friend. Include practical tips, local insights, and specific recommendations when possible.
    
    Keep responses concise but informative (2-3 paragraphs max).`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: generateTravelPrompt(inputMessage) }],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling ChatGPT:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🤖",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chat-toggle ${isOpen ? 'hidden' : ''}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="chat-toggle-btn"
          title="Chat with AI Travel Buddy"
        >
          <MessageCircle size={24} />
          <span className="chat-notification">💬</span>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar">
              <Bot size={20} />
            </div>
            <div>
              <h3>AI Travel Buddy</h3>
              <span className="status">Online • Ready to help!</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="chat-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot-message">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI Travel Buddy is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about destinations, activities, tips..."
              className="chat-input"
              rows="1"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="chat-send-btn"
            >
              {isTyping ? <Loader size={20} className="spinning" /> : <Send size={20} />}
            </button>
          </div>
          <div className="chat-suggestions">
            <button onClick={() => setInputMessage("What are the best activities in Paris?")}>
              🗼 Activities
            </button>
            <button onClick={() => setInputMessage("What's the best time to visit?")}>
              🌤️ Weather
            </button>
            <button onClick={() => setInputMessage("Any local food recommendations?")}>
              Food
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

TravelBuddyChat.propTypes = {
  tripData: PropTypes.shape({
    destination: PropTypes.string,
    dates: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }),
    participants: PropTypes.number,
    travelers: PropTypes.number,
    budget: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string)
  })
};

export default TravelBuddyChat;
