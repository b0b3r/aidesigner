import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeElementsSelectable, extractElementProperties, getAllElements } from '../utils/htmlParser';

const ElementSelector = ({ 
  htmlContent, 
  selectedElementId, 
  onElementSelect, 
  onElementHover,
  showOutlines = true 
}) => {
  const containerRef = useRef(null);
  const [hoveredElementId, setHoveredElementId] = useState(null);
  const [selectableHtml, setSelectableHtml] = useState('');

  // Обновляем HTML с data-element-id атрибутами
  useEffect(() => {
    if (htmlContent) {
      const enhanced = makeElementsSelectable(htmlContent);
      setSelectableHtml(enhanced);
    }
  }, [htmlContent]);

  // Обработчик клика на элемент
  const handleElementClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const elementId = event.target.getAttribute('data-element-id');
    if (elementId && onElementSelect) {
      console.log('🎯 Выбран элемент:', elementId, event.target.tagName);
      onElementSelect(elementId, event.target);
    }
  }, [onElementSelect]);

  // Обработчик hover на элемент
  const handleElementHover = useCallback((event) => {
    const elementId = event.target.getAttribute('data-element-id');
    if (elementId !== hoveredElementId) {
      setHoveredElementId(elementId);
      if (onElementHover) {
        onElementHover(elementId, event.target);
      }
    }
  }, [hoveredElementId, onElementHover]);

  // Обработчик выхода из hover
  const handleElementLeave = useCallback(() => {
    setHoveredElementId(null);
    if (onElementHover) {
      onElementHover(null, null);
    }
  }, [onElementHover]);

  // Добавляем event listeners после рендера
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('[data-element-id]');
    
    elements.forEach(element => {
      element.addEventListener('click', handleElementClick);
      element.addEventListener('mouseenter', handleElementHover);
      element.addEventListener('mouseleave', handleElementLeave);
      
      // Добавляем стили для интерактивности
      element.style.cursor = 'pointer';
      element.style.transition = 'all 0.2s ease';
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('click', handleElementClick);
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [selectableHtml, handleElementClick, handleElementHover, handleElementLeave]);

  // Применяем стили outline для выбранного и hovered элементов
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !showOutlines) return;

    // Убираем все предыдущие outline
    const allElements = container.querySelectorAll('[data-element-id]');
    allElements.forEach(el => {
      el.style.outline = 'none';
      el.style.backgroundColor = el.getAttribute('data-original-bg') || el.style.backgroundColor;
    });

    // Добавляем outline для выбранного элемента
    if (selectedElementId) {
      const selectedEl = container.querySelector(`[data-element-id="${selectedElementId}"]`);
      if (selectedEl) {
        selectedEl.style.outline = '2px solid #007bff';
        selectedEl.style.outlineOffset = '2px';
      }
    }

    // Добавляем hover эффект
    if (hoveredElementId && hoveredElementId !== selectedElementId) {
      const hoveredEl = container.querySelector(`[data-element-id="${hoveredElementId}"]`);
      if (hoveredEl) {
        hoveredEl.style.outline = '1px dashed #007bff';
        hoveredEl.style.outlineOffset = '1px';
      }
    }
  }, [selectedElementId, hoveredElementId, selectableHtml, showOutlines]);

  return (
    <div className="element-selector">
      {/* Preview контейнер с интерактивными элементами */}
      <div 
        ref={containerRef}
        className="selectable-content"
        dangerouslySetInnerHTML={{ __html: selectableHtml }}
        style={{
          position: 'relative',
          minHeight: '100px',
          padding: '10px',
          border: '1px solid #e1e1e1',
          borderRadius: '4px',
          backgroundColor: '#fff'
        }}
      />
      
      {/* Информация о выбранном элементе */}
      {selectedElementId && (
        <div className="selected-element-info" style={{
          marginTop: '10px',
          padding: '8px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Выбран:</strong> {selectedElementId}
          {hoveredElementId && hoveredElementId !== selectedElementId && (
            <span style={{ marginLeft: '10px' }}>
              <strong>Hover:</strong> {hoveredElementId}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ElementSelector;