import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  Plus,
  BookOpen,
  ArrowUp,
  Paperclip,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { SuggestionButtons } from "./SuggestionButtons";
import { ChatMessage } from "../types";

interface ChatBotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export function ChatBot({
  messages,
  onSendMessage,
  isGenerating,
}: ChatBotProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
      if (scrollContainer) {
        scrollContainer.scrollTop =
          scrollContainer.scrollHeight;
      }
    }
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (inputValue.trim() && !isGenerating) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSuggestionClick = (value: string) => {
    if (!isGenerating) {
      onSendMessage(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Здесь можно добавить логику обработки файла
      console.log("Выбран файл:", file.name);
      // Для демонстрации отправляем сообщение о загрузке файла
      onSendMessage(`Загружен файл: ${file.name}`);
    }
  };

  // Проверяем, есть ли активные саджесты (от последнего AI сообщения)
  const lastAiMessage = [...messages]
    .reverse()
    .find((m) => m.type === "ai");
  const hasActiveSuggestions =
    lastAiMessage?.suggestions && !isGenerating;

  return (
    <div className="w-80 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h2>UI Design Assistant</h2>
        </div>
        <p className="text-muted-foreground mt-1">
          Опишите что хотите создать
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.type === "user" ? (
                  // User message - with bubble on the right
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  // AI message - plain text without bubble
                  <div className="max-w-[95%]">
                    <div className="text-foreground">
                      <p className="whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.hasArtifact && (
                        <div className="text-muted-foreground mt-2 flex items-center gap-1">
                          <span className="text-lg">📎</span>
                          <span>
                            Артефакт создан на канвасе
                          </span>
                        </div>
                      )}

                      {/* Показываем саджесты только для последнего AI сообщения */}
                      {index === messages.length - 1 &&
                        message.suggestions && (
                          <SuggestionButtons
                            suggestions={message.suggestions}
                            onSuggestionClick={
                              handleSuggestionClick
                            }
                            disabled={isGenerating}
                          />
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="max-w-[95%]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                  <span>Генерирую ответ...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        {/* Input field container */}
        <div className="rounded-2xl bg-input-background border-0 p-3">
          {/* Textarea on top */}
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasActiveSuggestions
                ? "Или выберите вариант выше..."
                : "Опишите что хотите создать..."
            }
            className="resize-none border-0 bg-transparent p-0 min-h-[120px] max-h-[160px] focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={5}
            disabled={isGenerating}
          />

          {/* Bottom row with buttons */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            {/* Left buttons */}
            <div className="flex gap-1">
              {/* File upload button */}
              <Button
                onClick={handleFileClick}
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 hover:bg-accent"
                disabled={isGenerating}
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>

              {/* Library/Template button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 hover:bg-accent"
                disabled={isGenerating}
              >
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Send button on the right */}
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isGenerating}
              size="sm"
              className="h-8 w-8 rounded-lg p-0 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {/* File upload hint */}
        <div className="mt-2 px-2"></div>
      </div>
    </div>
  );
}