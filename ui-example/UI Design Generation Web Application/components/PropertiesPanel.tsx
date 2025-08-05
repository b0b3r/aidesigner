import { useState } from 'react';
import { X, Wand2, Code, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DesignElement } from '../types';

interface PropertiesPanelProps {
  element: DesignElement | null;
  onClose: () => void;
  onRegenerateElement: (id: string, newPrompt: string) => void;
  onUpdateElementCode: (id: string, newCode: string) => void;
}

export function PropertiesPanel({
  element,
  onClose,
  onRegenerateElement,
  onUpdateElementCode,
}: PropertiesPanelProps) {
  const [editedPrompt, setEditedPrompt] = useState(element?.prompt || '');
  const [editedCode, setEditedCode] = useState(element?.code || '');
  const [copied, setCopied] = useState(false);

  if (!element) return null;

  const handleRegeneratee = () => {
    if (editedPrompt.trim()) {
      onRegenerateElement(element.id, editedPrompt.trim());
    }
  };

  const handleUpdateCode = () => {
    if (editedCode.trim()) {
      onUpdateElementCode(element.id, editedCode.trim());
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="w-80 h-screen bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3>{element.name}</h3>
          <p className="text-muted-foreground">{element.type}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
          <div className="flex-shrink-0 px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Промпт
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Код
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prompt" className="flex-1 min-h-0 p-4">
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1 min-h-0">
                <label className="block mb-2">
                  Промпт для генерации
                </label>
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  placeholder="Описание элемента для генерации..."
                  className="h-32 resize-none"
                />
              </div>
              
              <Button
                onClick={handleRegeneratee}
                disabled={!editedPrompt.trim() || editedPrompt === element.prompt}
                className="w-full flex-shrink-0"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Сгенерировать заново
              </Button>
              
              {element.children && element.children.length > 0 && (
                <div className="flex-1 min-h-0">
                  <label className="block mb-2">
                    Дочерние элементы ({element.children.length})
                  </label>
                  <ScrollArea className="h-32">
                    <div className="space-y-2 pr-4">
                      {element.children.map((child) => (
                        <div
                          key={child.id}
                          className="p-2 border border-border rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <div>{child.name}</div>
                          <div className="text-muted-foreground truncate">
                            {child.prompt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 min-h-0 p-4">
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-shrink-0 flex items-center justify-between">
                <label>HTML/CSS код</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  disabled={!editedCode.trim()}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <Textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    placeholder="HTML/CSS код элемента..."
                    className="min-h-96 resize-none font-mono"
                  />
                </ScrollArea>
              </div>
              
              <Button
                onClick={handleUpdateCode}
                disabled={!editedCode.trim() || editedCode === element.code}
                className="w-full flex-shrink-0"
              >
                <Code className="w-4 h-4 mr-2" />
                Применить изменения
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}