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
    <div className="panel properties-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="panel-header">
        <span>⚙️ Свойства элемента</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onElementDelete?.(element.id)}
            className="btn btn-danger" 
            style={{ padding: '4px 8px', color: 'white', border: 'none', borderRadius: '4px' }}
            title="Удалить элемент"
          >
            🗑️
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>
      </div>

      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Информация */}
        <div className="p-3 border-b border-gray-200" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <div className="selected-info" style={{ fontSize: '14px', color: '#999', marginTop: '0px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Выбран: {selectedInternalElementId || element?.name || element?.id}
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex border-b border-gray-200" style={{ flex: '0 0 auto' }}>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Промпт для генерации</label>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                placeholder="Введите описание..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={handleRegenerate} className="btn btn-primary flex-1" disabled={!editedPrompt.trim() || isRegenerating}>
                  {isRegenerating ? '⏳ Генерирую...' : '🔄 Перегенерировать'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">HTML/CSS код</label>
              <textarea
                value={editedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

       
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;