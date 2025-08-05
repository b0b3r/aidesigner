import React, { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="panel chat-panel">
      <div className="panel-header">
        <span>💬 Чат с ИИ</span>
      </div>
      
      <div className="panel-content">
        <div className="flex-1 overflow-y-auto p-3" style={{ flex: 1 }}>
          {messages.map((message, index) => (
            <div key={index} className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className="inline-block max-w-xs p-3 rounded-lg"
                style={{
                  backgroundColor: message.role === 'user' ? '#0066cc' : '#f8f9fa',
                  color: message.role === 'user' ? 'white' : '#333',
                  borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  maxWidth: '85%'
                }}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="mb-3 text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-lg">
                <span className="text-sm text-gray-600">Генерирую ответ...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Опишите, что вы хотите создать..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSending ? '...' : '→'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;