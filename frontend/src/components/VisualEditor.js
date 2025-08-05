import React, { useState, useCallback, useEffect } from 'react';
import VisualControls from './VisualControls';
import { extractElementProperties, applyElementProperties, getElementInfo, makeElementsSelectable } from '../utils/htmlParser';
import './VisualEditor.css';

const VisualEditor = ({ 
  element, 
  selectedInternalElement,
  onContentChange, 
  onElementUpdate,
  className = '' 
}) => {
  const [selectedElementData, setSelectedElementData] = useState(null);
  const [currentContent, setCurrentContent] = useState(element?.content || '');

  // Обновляем контент при изменении element
  useEffect(() => {
    if (element?.content !== currentContent) {
      setCurrentContent(element.content || '');
      // Сбрасываем выбор при изменении контента
      setSelectedElementData(null);
    }
  }, [element?.content, currentContent]);

  // Обновляем selectedElementData при изменении selectedInternalElement
  useEffect(() => {
    console.log('🔍 DEBUG: selectedInternalElement изменился:', selectedInternalElement);
    console.log('🔍 DEBUG: element:', element?.name);
    console.log('🔍 DEBUG: currentContent length:', currentContent?.length);
    
    if (selectedInternalElement && element) {
      console.log('📌 Обновляем данные выбранного внутреннего элемента:', selectedInternalElement);
      
      // Обрабатываем HTML чтобы добавить data-element-id если их нет
      const selectableContent = makeElementsSelectable(currentContent);
      console.log('🔍 DEBUG: selectableContent создан');
      
      // Получаем информацию об элементе из обработанного HTML
      const elementInfo = getElementInfo(selectableContent, selectedInternalElement);
      console.log('🔍 DEBUG: elementInfo:', elementInfo);
      
      if (elementInfo) {
        // Создаем временный DOM элемент для извлечения стилей
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectableContent;
        const domElement = tempDiv.querySelector(`[data-element-id="${selectedInternalElement}"]`);
        console.log('🔍 DEBUG: domElement найден:', !!domElement);
        
        if (domElement) {
          // Добавляем в DOM для вычисления стилей
          document.body.appendChild(tempDiv);
          const properties = extractElementProperties(domElement);
          document.body.removeChild(tempDiv);
          
          const elementData = {
            id: selectedInternalElement,
            domElement,
            properties,
            info: elementInfo
          };
          
          console.log('🎨 Свойства выбранного элемента:', properties);
          console.log('✅ Устанавливаем selectedElementData:', elementData);
          setSelectedElementData(elementData);
        } else {
          console.log('❌ domElement не найден для:', selectedInternalElement);
          setSelectedElementData(null);
        }
      } else {
        console.log('❌ elementInfo не найден для:', selectedInternalElement);
        setSelectedElementData(null);
      }
    } else {
      console.log('🔄 Сбрасываем selectedElementData');
      setSelectedElementData(null);
    }
  }, [selectedInternalElement, currentContent, element]);

  // Обработчик изменения свойства
  const handlePropertyChange = useCallback((property, value) => {
    if (!selectedInternalElement || !selectedElementData) return;

    console.log('🔧 Изменяем свойство:', property, '→', value);

    // Обрабатываем HTML чтобы добавить data-element-id для правильного поиска
    const selectableContent = makeElementsSelectable(currentContent);
    
    // Обновляем HTML с новым свойством
    const updatedSelectableContent = applyElementProperties(selectableContent, selectedInternalElement, {
      [property]: value
    });

    // Удаляем data-element-id атрибуты для сохранения чистого HTML
    const cleanContent = updatedSelectableContent.replace(/\s*data-element-id="[^"]*"/g, '')
                                                  .replace(/\s*data-element-type="[^"]*"/g, '')
                                                  .replace(/\s*data-original-style="[^"]*"/g, '');

    // Обновляем локальное состояние
    setCurrentContent(cleanContent);

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
      onContentChange(cleanContent);
    }

    // Обновляем элемент в родительском состоянии
    if (onElementUpdate && element) {
      onElementUpdate(element.id, { content: cleanContent });
    }
  }, [selectedInternalElement, selectedElementData, currentContent, onContentChange, onElementUpdate, element]);

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
      {/* Простая панель управления */}
      <div className="visual-editor-toolbar">
        <span className="toolbar-title">🎨 Визуальный редактор</span>
        {selectedInternalElement ? (
          <span className="selected-info">
            Выбран: <code>{selectedInternalElement}</code>
          </span>
        ) : (
          <span className="no-selection-info">
            Кликните на элемент в артефакте на канвасе
          </span>
        )}
      </div>

      {/* Только панель контролов */}
      <div className="visual-editor-content">
        <VisualControls
          selectedElement={selectedElementData}
          onPropertyChange={handlePropertyChange}
        />
      </div>

      {/* Debug Info (только в development) */}
      {process.env.NODE_ENV === 'development' && selectedElementData && (
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
          <div>Selected: {selectedInternalElement || 'none'}</div>
          <div>Type: {selectedElementData.info?.tagName}</div>
          <div>Props: {Object.keys(selectedElementData.properties || {}).length}</div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;