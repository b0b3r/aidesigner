import React, { useState, useCallback } from 'react';

const PropertiesPanel = ({ element, onElementUpdate, onElementDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [editedPrompt, setEditedPrompt] = useState(element.prompt || '');
  const [editedCode, setEditedCode] = useState(element.content || '');
  const [isRegenerating, setIsRegenerating] = useState(false);

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
    <div className="panel properties-panel">
      <div className="panel-header">
        <span>⚙️ Свойства элемента</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onElementDelete?.(element.id)}
            className="btn btn-danger" 
            style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            title="Удалить элемент"
          >
            🗑️
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>
      </div>

      <div className="panel-content">
        {/* Информация */}
        <div className="p-3 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            <strong>ID:</strong> {element.id}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Тип:</strong> {element.type}
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'prompt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            📝 Промпт
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'code' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            💻 Код
          </button>
        </div>

        {/* Содержимое */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'prompt' && (
            <div className="p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Промпт для генерации:
              </label>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                placeholder="Введите описание..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleRegenerate}
                  className="btn btn-primary flex-1"
                  disabled={!editedPrompt.trim() || isRegenerating}
                >
                  {isRegenerating ? '⏳ Генерирую...' : '🔄 Перегенерировать'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML/CSS код:
              </label>
              <textarea
                value={editedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Позиция */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs font-medium text-gray-700 mb-2">Позиция:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label>X:</label>
              <input
                type="number"
                value={element.x || 0}
                onChange={(e) => onElementUpdate(element.id, { x: parseInt(e.target.value) })}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label>Y:</label>
              <input
                type="number"
                value={element.y || 0}
                onChange={(e) => onElementUpdate(element.id, { y: parseInt(e.target.value) })}
                className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;