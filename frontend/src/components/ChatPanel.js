import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ChatPanel.css';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { Send, X, Loader2 } from 'lucide-react';

const ChatPanel = ({ 
  chatMessages, 
  setChatMessages, 
  isLoading, 
  loadingStatus, 
  editingElement, 
  setEditingElement,
  onSendMessage,
  onSuggestionClick,
  onContextMenu
}) => {
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoading]);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleCancelEditing = useCallback(() => {
    setEditingElement(null);
    console.log('🔄 Режим редактирования отменен пользователем');
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + '-cancel',
        type: 'ai',
        // content: `🔄 Режим редактирования отменен. Теперь вы можете создавать новые элементы или выбрать другой элемент для редактирования.`,
        timestamp: new Date()
      }
    ]);
  }, [setEditingElement, setChatMessages]);

  return (
    <div className="chat-panel">
      <div className="panel-header items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-semibold">UI Design Assistant</h2>
        
          </div>
          <ThemeToggle />
        {/* {editingElement && (
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 mt-2">
            ✏️ Редактирование: {editingElement.name}
          </div>
        )} */}
      </div>
      
          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div 
                key={message.id} 
                className={`chat-message ${message.type}`}
                onContextMenu={(e) => onContextMenu(e, message.content)}
              >
                <div className="message-content">{message.content}</div>
                
                {/* Кнопки-саджесты */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="message-suggestions">
                    {message.suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onSuggestionClick(suggestion)}
                        disabled={isLoading}
                        className="text-xs rounded-full"
                      >
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div id="chat-bottom-anchor" ref={chatBottomRef} />
            
            {/* Индикатор загрузки */}
            {isLoading && (
              <div className="chat-message ai loading">
                <div className="message-content">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <div className="loading-text">{loadingStatus}</div>
                    {/* <Badge variant="secondary" className="ml-auto">Обработка...</Badge> */}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input">


          
            {editingElement && (
              <Badge className="text-xs inline-flex items-center gap-1 mb-2">
                {editingElement.name}
                <button
                  onClick={handleCancelEditing}
                  // className=" hover:bg-muted-foreground/20 p-0.5"
                  title="Отменить"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}


            <textarea className='textinput'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Обрабатываю запрос..." : editingElement ? `Редактирование "${editingElement.name}" - опишите изменения...` : "Задавайте вопросы, описывайте задачи, создавайте дизайн экранов и флоу"}
              rows={2}
              disabled={isLoading}
            />

    
            <div className="flex gap-2 mt-2 justify-end">


            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="default"
              size="icon"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            </div>
            </div>
    </div>
  );
};

  export default ChatPanel;