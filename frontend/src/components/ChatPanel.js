import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ChatPanel.css';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ThemeToggle } from './ThemeToggle';

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
        content: `🔄 Режим редактирования отменен. Теперь вы можете создавать новые элементы или выбрать другой элемент для редактирования.`,
        timestamp: new Date()
      }
    ]);
  }, [setEditingElement, setChatMessages]);

  return (
    <div className="chat-panel">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">🚀 UI Design Assistant</CardTitle>
              {editingElement && (
                <Badge variant="outline" className="text-xs">
                  Редактирование: {editingElement.name}
                </Badge>
              )}
            </div>
            <ThemeToggle />
          </div>
          {editingElement && (
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
              ✏️ Редактирование: {editingElement.name}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
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
                    <div className="loading-spinner">⏳</div>
                    <div className="loading-text">{loadingStatus}</div>
                    <Badge variant="secondary" className="ml-auto">Обработка...</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Обрабатываю запрос..." : editingElement ? `Редактирование "${editingElement.name}" - опишите изменения...` : "Попробуйте: 'добавить элемент' или 'расскажи про flow'"}
              rows={2}
              disabled={isLoading}
              className="w-full p-3 bg-muted border border-border rounded-lg resize-none min-h-[120px] font-inter text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            />
            {editingElement && (
              <Button 
                onClick={handleCancelEditing}
                variant="secondary"
                size="sm"
                className="mr-2"
                title="Отменить редактирование"
                disabled={isLoading}
              >
                ✕ Отменить
              </Button>
            )}
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="default"
              size="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Отправить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPanel;