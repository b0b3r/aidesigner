import React, { useState, useCallback, useEffect } from 'react';
import ElementSelector from './ElementSelector';
import VisualControls from './VisualControls';
import { extractElementProperties, applyElementProperties, getElementInfo } from '../utils/htmlParser';
import './VisualEditor.css';

const VisualEditor = ({ 
  element, 
  onContentChange, 
  onElementUpdate,
  className = '' 
}) => {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedElementData, setSelectedElementData] = useState(null);
  const [hoveredElementId, setHoveredElementId] = useState(null);
  const [currentContent, setCurrentContent] = useState(element?.content || '');

  // Обновляем контент при изменении element
  useEffect(() => {
    if (element?.content !== currentContent) {
      setCurrentContent(element.content || '');
      // Сбрасываем выбор при изменении контента
      setSelectedElementId(null);
      setSelectedElementData(null);
    }
  }, [element?.content]);

  // Обработчик выбора элемента
  const handleElementSelect = useCallback((elementId, domElement) => {
    console.log('📌 Выбираем элемент для редактирования:', elementId);
    
    setSelectedElementId(elementId);
    
    if (domElement) {
      // Извлекаем свойства из DOM элемента
      const properties = extractElementProperties(domElement);
      const elementInfo = getElementInfo(currentContent, elementId);
      
      const elementData = {
        id: elementId,
        domElement,
        properties,
        info: elementInfo
      };
      
      console.log('🎨 Свойства элемента:', properties);
      setSelectedElementData(elementData);
    }
  }, [currentContent]);

  // Обработчик hover элемента  
  const handleElementHover = useCallback((elementId, domElement) => {
    setHoveredElementId(elementId);
  }, []);

  // Обработчик изменения свойства
  const handlePropertyChange = useCallback((property, value) => {
    if (!selectedElementId || !selectedElementData) return;

    console.log('🔧 Изменяем свойство:', property, '→', value);

    // Обновляем HTML с новым свойством
    const updatedContent = applyElementProperties(currentContent, selectedElementId, {
      [property]: value
    });

    // Обновляем локальное состояние
    setCurrentContent(updatedContent);

    // Обновляем свойства выбранного элемента
    setSelectedElementData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [property]: value
      }
    }));

    // Уведомляем родительский компонент
    if (onContentChange) {
      onContentChange(updatedContent);
    }

    // Обновляем элемент в родительском состоянии
    if (onElementUpdate && element) {
      onElementUpdate(element.id, { content: updatedContent });
    }
  }, [selectedElementId, selectedElementData, currentContent, onContentChange, onElementUpdate, element]);

  // Сброс выбора
  const handleClearSelection = useCallback(() => {
    setSelectedElementId(null);
    setSelectedElementData(null);
  }, []);

  if (!element) {
    return (
      <div className={`visual-editor no-element ${className}`}>
        <div className="no-element-message">
          <p>Нет выбранного элемента для редактирования</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`visual-editor ${className}`}>
      {/* Toolbar */}
      <div className="visual-editor-toolbar">
        <span className="toolbar-title">📝 Визуальный редактор</span>
        {selectedElementId && (
          <>
            <span className="selected-info">
              Выбран: <code>{selectedElementId}</code>
            </span>
            <button
              onClick={handleClearSelection}
              className="clear-selection-btn"
              style={{
                marginLeft: 'auto',
                padding: '4px 8px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              ✕ Сбросить
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="visual-editor-content">
        {/* Canvas - Element Selector */}
        <div className="visual-editor-canvas">
          <ElementSelector
            htmlContent={currentContent}
            selectedElementId={selectedElementId}
            onElementSelect={handleElementSelect}
            onElementHover={handleElementHover}
            showOutlines={true}
          />
        </div>

        {/* Properties Panel */}
        <div className="visual-editor-properties">
          <VisualControls
            selectedElement={selectedElementData}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </div>

      {/* Debug Info (только в development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          maxWidth: '200px'
        }}>
          <div>Selected: {selectedElementId || 'none'}</div>
          <div>Hovered: {hoveredElementId || 'none'}</div>
          {selectedElementData && (
            <div>Type: {selectedElementData.info?.tagName}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisualEditor;