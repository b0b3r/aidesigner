import React, { useState, useCallback } from 'react';
import VisualEditor from './VisualEditor';

const PropertiesPanel = ({ element, selectedInternalElement, onElementUpdate, onElementDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [editedPrompt, setEditedPrompt] = useState(element.prompt || '');
  const [editedCode, setEditedCode] = useState(element.content || '');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Определяем ID внутреннего выбранного элемента, относящегося к текущему артефакту
  const selectedInternalElementId =
    selectedInternalElement &&
    selectedInternalElement.artifactId === element.id
      ? selectedInternalElement.elementId
      : null;

  // Убираем дополнительные секции (Figma-like) — оставляем редактирование ТОЛЬКО во вкладке Visual

  // Обновляем состояние при изменении выбранного элемента
  React.useEffect(() => {
    setEditedPrompt(element.prompt || '');
    setEditedCode(element.content || '');
    setActiveTab('visual');
  }, [element.id, element.prompt, element.content]);

  const handleCodeChange = useCallback((newCode) => {
    setEditedCode(newCode);
    onElementUpdate(element.id, { content: newCode });
  }, [element.id, onElementUpdate]);

  const handleRegenerate = useCallback(async () => {
    if (!editedPrompt.trim()) return;

    setIsRegenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: editedPrompt }]
        })
      });

      const data = await response.json();
      
      if (data.success && data.visual_content) {
        onElementUpdate(element.id, {
          content: data.visual_content,
          prompt: editedPrompt,
          generatedAt: new Date().toISOString()
        });
        setEditedCode(data.visual_content);
      }
    } catch (error) {
      console.error('Ошибка при регенерации:', error);
    } finally {
      setIsRegenerating(false);
    }
  }, [editedPrompt, element.id, onElementUpdate]);

  return (
    <div className="properties-panel flex flex-col h-full overflow-hidden">
      <div className="panel-header">
        <span>Свойства</span>
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => onElementDelete?.(element.id)}
            className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors" 
            title="Удалить элемент"
          >
            🗑️
          </button>
          <button 
            onClick={onClose} 
            className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Информация */}
        <div  style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <div className="selected-info" style={{ fontSize: '14px', color: '#999', marginTop: '0px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Выбран: {selectedInternalElementId || element?.name || element?.id}
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex" style={{ flex: '0 0 auto' }}>
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'visual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            Настройки
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'prompt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            Промпт
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'code' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            Код
          </button>
        </div>

        {/* Содержимое */}
        <div className="flex-1" style={{ paddingBottom: 8, overflowY: 'auto', scrollbarWidth: 'none' }}>
          <style>{`.panel .flex-1::-webkit-scrollbar{display:none}`}</style>
          {activeTab === 'visual' && (
            <div className="h-full">
              <VisualEditor
                element={element}
                selectedInternalElement={selectedInternalElementId}
                onContentChange={(newContent) => {
                  setEditedCode(newContent);
                  onElementUpdate(element.id, { content: newContent });
                }}
                onElementUpdate={onElementUpdate}
                className="h-full"
              />
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="p-3">
              <label className="block text-sm font-medium text-foreground mb-2">Промпт для генерации</label>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                placeholder="Введите описание..."
                className="w-full h-32 p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={handleRegenerate} 
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                  disabled={!editedPrompt.trim() || isRegenerating}
                >
                  {isRegenerating ? '⏳ Генерирую...' : 'Генерировать заново'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-3 h-full flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">HTML/CSS код</label>
              <textarea
                value={editedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full flex-1 p-3 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
          )}

       
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;