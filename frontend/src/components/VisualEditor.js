import React, { useState, useCallback, useEffect, useRef } from 'react';
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

  // Обновляем контент при изменении element (избегаем циклов)
  useEffect(() => {
    if (element?.content && element.content !== currentContent) {
      setCurrentContent(element.content);
      // НЕ сбрасываем selectedElementData здесь, чтобы избежать циклов
    }
  }, [element?.content]);

  // Обновляем selectedElementData при изменении selectedInternalElement
  useEffect(() => {
    if (selectedInternalElement && element) {
      console.log('📌 Выбираем элемент для редактирования:', selectedInternalElement);
      
      // Обрабатываем HTML чтобы добавить data-element-id если их нет
      const selectableContent = makeElementsSelectable(currentContent);
      
      // Получаем информацию об элементе из обработанного HTML
      const elementInfo = getElementInfo(selectableContent, selectedInternalElement);
      
      if (elementInfo) {
        // Создаем временный DOM элемент для извлечения стилей
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectableContent;
        const domElement = tempDiv.querySelector(`[data-element-id="${selectedInternalElement}"]`);
        
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
          
          console.log('✅ Данные элемента загружены:', elementInfo.tagName);
          setSelectedElementData(elementData);
        } else {
          setSelectedElementData(null);
        }
      } else {
        setSelectedElementData(null);
      }
    } else {
      setSelectedElementData(null);
    }
  }, [selectedInternalElement, currentContent, element]);

  // Debounce для обновления HTML
  const updateTimeoutRef = useRef(null);
  
  // Обработчик изменения свойства
  const handlePropertyChange = useCallback((property, value) => {
    if (!selectedInternalElement || !selectedElementData) return;

    console.log('🔧 Изменяем свойство:', property, '→', value, typeof value);

    // Мгновенно обновляем UI (selectedElementData)
    setSelectedElementData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [property]: value
      }
    }));

    // Debounce обновления HTML (300ms)
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
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

      // Уведомляем родительский компонент
      if (onContentChange) {
        onContentChange(cleanContent);
      }

      // Обновляем элемент в родительском состоянии
      if (onElementUpdate && element) {
        onElementUpdate(element.id, { content: cleanContent });
      }
      
      console.log('✅ HTML обновлен с debounce');
    }, 300);
  }, [selectedInternalElement, selectedElementData, currentContent, onContentChange, onElementUpdate, element]);

  // Cleanup timeout при размонтировании
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
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
      {/* Простая панель управления */}
      <div className="visual-editor-toolbar">
        {/* <span className="toolbar-title">🎨 Визуальный редактор</span> */}
       
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