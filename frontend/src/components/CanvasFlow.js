import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { makeElementsSelectable } from '../utils/htmlParser';

// Кастомный узел для UI компонента
const UIComponentNode = ({ data, selected }) => {
  const contentRef = useRef(null);
  const [hoveredElementId, setHoveredElementId] = useState(null);
  
  const nodeStyle = {
    width: data.width ? `${data.width}px` : 'auto',
    height: data.height ? `${data.height}px` : 'auto',
    minWidth: data.width ? `${data.width}px` : '200px',
    minHeight: data.height ? `${data.height}px` : 'auto'
  };
  
  // Подготавливаем HTML с data-element-id для интерактивности
  const selectableContent = useMemo(() => {
    if (!data.content) return '';
    return makeElementsSelectable(data.content);
  }, [data.content]);
  
  // Обработчик клика на внутренние элементы
  const handleElementClick = useCallback((event) => {
    const elementId = event.target.getAttribute('data-element-id');
    if (elementId && data.onElementSelect) {
      event.preventDefault();
      event.stopPropagation();
      console.log('🎯 Выбираем элемент в артефакте:', elementId, 'в артефакте:', data.id);
      data.onElementSelect(data.id, elementId, event.target);
    }
  }, [data.id, data.onElementSelect]);
  
  // Обработчик hover на элементы
  const handleElementHover = useCallback((event) => {
    const elementId = event.target.getAttribute('data-element-id');
    if (elementId !== hoveredElementId) {
      setHoveredElementId(elementId);
    }
  }, [hoveredElementId]);
  
  // Обработчик выхода из hover
  const handleElementLeave = useCallback(() => {
    setHoveredElementId(null);
  }, []);
  
  // Добавляем event listeners после рендера
  useEffect(() => {
    const container = contentRef.current;
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
  }, [selectableContent, handleElementClick, handleElementHover, handleElementLeave]);
  
  // Применяем стили outline для выбранного и hovered элементов
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Убираем все предыдущие outline и фоны
    const allElements = container.querySelectorAll('[data-element-id]');
    allElements.forEach(el => {
      el.style.outline = 'none';
      el.style.outlineOffset = '';
      // Восстанавливаем оригинальный фон или убираем его
      const originalBg = el.getAttribute('data-original-bg');
      if (originalBg) {
        el.style.backgroundColor = originalBg;
      } else {
        el.style.backgroundColor = '';
      }
    });

    // Добавляем outline для выбранного элемента
    if (data.selectedInternalElement) {
      const selectedEl = container.querySelector(`[data-element-id="${data.selectedInternalElement}"]`);
      if (selectedEl) {
        // Сохраняем оригинальный фон если не сохранен
        if (!selectedEl.getAttribute('data-original-bg')) {
          selectedEl.setAttribute('data-original-bg', selectedEl.style.backgroundColor || '');
        }
        selectedEl.style.outline = '2px solid #007bff';
        selectedEl.style.outlineOffset = '2px';
      }
    }

    // Добавляем hover эффект
    if (hoveredElementId && hoveredElementId !== data.selectedInternalElement) {
      const hoveredEl = container.querySelector(`[data-element-id="${hoveredElementId}"]`);
      if (hoveredEl) {
        // Сохраняем оригинальный фон если не сохранен
        if (!hoveredEl.getAttribute('data-original-bg')) {
          hoveredEl.setAttribute('data-original-bg', hoveredEl.style.backgroundColor || '');
        }
        hoveredEl.style.outline = '1px dashed #007bff';
        hoveredEl.style.outlineOffset = '1px';
        hoveredEl.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
      }
    }
  }, [data.selectedInternalElement, hoveredElementId, selectableContent]);

  // Cleanup эффект для очистки всех overlay при размонтировании компонента
  useEffect(() => {
    return () => {
      const container = contentRef.current;
      if (container) {
        const allElements = container.querySelectorAll('[data-element-id]');
        allElements.forEach(el => {
          el.style.outline = 'none';
          el.style.outlineOffset = '';
          el.style.backgroundColor = '';
          el.removeAttribute('data-original-bg');
        });
      }
    };
  }, []);
  
  return (
    <div className={`ui-flow-node ${selected ? 'selected' : ''}`} style={nodeStyle}>
      <div className="ui-flow-header">
        <span className="ui-flow-title">{data.name}</span>
        <div className="ui-flow-actions">
          <button 
            onClick={() => data.onRegenerate?.(data.id)}
            className="ui-flow-btn"
            title="Регенерировать"
          >
            🔄
          </button>
          <button 
            onClick={() => data.onEdit?.(data.id)}
            className="ui-flow-btn"
            title="Редактировать"
          >
            ✏️
          </button>
        </div>
      </div>
      
      <div className="ui-flow-content">
        {data.content ? (
          <div 
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: selectableContent }}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              fontSize: '12px',
              position: 'relative'
            }}
          />
        ) : (
          <div className="ui-flow-text">{data.name || 'Пустой элемент'}</div>
        )}
      </div>
      
      {data.prompt && (
        <div className="ui-flow-footer">
          <small title={data.prompt}>💭 {data.prompt.slice(0, 30)}...</small>
        </div>
      )}
      
      {/* Показываем информацию о выбранном внутреннем элементе */}
      {data.selectedInternalElement && (
        <div className="selected-element-indicator">
          🎯 {data.selectedInternalElement}
        </div>
      )}

    </div>
  );
};

// Кастомный узел для процесса генерации
const ProcessNode = ({ data }) => {
  return (
    <div className="process-flow-node">
      <div className="process-flow-icon">{data.icon}</div>
      <div className="process-flow-title">{data.title}</div>
      {data.status && (
        <div className={`process-flow-status ${data.status}`}>
          {data.status === 'completed' && '✅'}
          {data.status === 'processing' && '⏳'}
          {data.status === 'pending' && '⏸️'}
        </div>
      )}
    </div>
  );
};

// Типы узлов
const nodeTypes = {
  uiComponent: UIComponentNode,
  process: ProcessNode,
};

const CanvasFlow = ({ 
  elements = [], 
  selectedElement, 
  onElementSelect, 
  onElementRegenerate,
  onElementEdit,
  onElementUpdate,
  selectedInternalElement,
  onInternalElementSelect
}) => {
  // Конвертируем существующие элементы в React Flow узлы
  const convertToFlowNodes = useCallback((elements) => {
    return elements.map((element) => ({
      id: element.id,
      type: 'uiComponent',
      position: { 
        x: element.x || 100, 
        y: element.y || 100 
      },
      data: {
        id: element.id,
        name: element.name || element.type || 'UI Element',
        content: element.content,
        type: element.type,
        prompt: element.prompt,
        createdAt: element.createdAt,
        onRegenerate: onElementRegenerate,
        onEdit: onElementEdit,
        onElementSelect: onInternalElementSelect,
        selectedInternalElement: selectedInternalElement?.artifactId === element.id ? selectedInternalElement.elementId : null,
      },
      style: {
        width: element.width || 200,
        height: element.height === 'auto' ? undefined : (element.height || 150),
      }
    }));
  }, [onElementRegenerate, onElementEdit, onInternalElementSelect, selectedInternalElement]);

  // Создаем процессные узлы для демонстрации workflow
  const processNodes = useMemo(() => [
    {
      id: 'process-1',
      type: 'process',
      position: { x: 50, y: 50 },
      data: {
        title: 'Анализ промпта',
        icon: '🤖',
        status: 'completed'
      }
    },
    {
      id: 'process-2', 
      type: 'process',
      position: { x: 250, y: 50 },
      data: {
        title: 'Генерация UI',
        icon: '🎨',
        status: 'completed'
      }
    },
    {
      id: 'process-3',
      type: 'process', 
      position: { x: 450, y: 50 },
      data: {
        title: 'Финализация',
        icon: '✨',
        status: 'pending'
      }
    }
  ], []);

  // Инициализируем состояние ПЕРЕД использованием в useMemo
  const [showProcessFlow, setShowProcessFlow] = useState(false);

  // Комбинируем узлы
  const initialNodes = useMemo(() => {
    const uiNodes = convertToFlowNodes(elements);
    // Убираем процессные узлы по просьбе пользователя
    return showProcessFlow ? [...processNodes, ...uiNodes] : [...uiNodes];
  }, [elements, processNodes, convertToFlowNodes, showProcessFlow]);

  // Создаем связи между процессными узлами
  const processEdges = useMemo(() => [
    {
      id: 'e1-2',
      source: 'process-1',
      target: 'process-2',
      type: 'smoothstep',
      animated: true,
      label: 'анализ завершен'
    },
    {
      id: 'e2-3',
      source: 'process-2', 
      target: 'process-3',
      type: 'smoothstep',
      label: 'готов к финализации'
    }
  ], []);

  const [nodes, setNodes, originalOnNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Кастомный обработчик изменения узлов, который сохраняет позиции в canvasElements
  const onNodesChange = useCallback((changes) => {
    // Применяем изменения к React Flow состоянию
    originalOnNodesChange(changes);
    
    // Обновляем позиции в исходных данных canvasElements
    changes.forEach((change) => {
      if (change.type === 'position' && change.position && change.id) {
        // Обновляем позицию элемента в родительском состоянии
        const elementIndex = elements.findIndex(el => el.id === change.id);
        if (elementIndex !== -1) {
          const updatedElement = {
            ...elements[elementIndex],
            x: Math.round(change.position.x),
            y: Math.round(change.position.y)
          };
          console.log('📍 Обновляем позицию элемента:', change.id, 'на', change.position);
          // Используем колбэк для обновления родительского состояния
          if (typeof onElementUpdate === 'function') {
            onElementUpdate(change.id, { x: Math.round(change.position.x), y: Math.round(change.position.y) });
          }
        }
      }
    });
  }, [originalOnNodesChange, elements, onElementUpdate]);

  // Обновляем узлы при изменении элементов (но сохраняем позиции)
  React.useEffect(() => {
    const uiNodes = convertToFlowNodes(elements);
    const newNodes = showProcessFlow ? [...processNodes, ...uiNodes] : uiNodes;
    
    // Сохраняем текущие позиции узлов, если они были изменены пользователем
    setNodes(currentNodes => {
      return newNodes.map(newNode => {
        const existingNode = currentNodes.find(n => n.id === newNode.id);
        if (existingNode && (existingNode.position.x !== newNode.position.x || existingNode.position.y !== newNode.position.y)) {
          // Если узел уже существует и был перемещен, сохраняем его текущую позицию
          return { ...newNode, position: existingNode.position };
        }
        return newNode;
      });
    });
  }, [elements, showProcessFlow, processNodes, convertToFlowNodes, setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    if (node.type === 'uiComponent') {
      const element = elements.find(el => el.id === node.id);
      if (element) {
        onElementSelect?.(element);
      }
    }
  }, [elements, onElementSelect]);

  const handleToggleProcessFlow = () => {
    setShowProcessFlow(prev => !prev);
  };

  const handleFitView = () => {
    // Функциональность будет добавлена через useReactFlow hook
  };

  return (
    <div className="canvas-flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView={false}
      >
        {/* Сетка из точек */}
        <Background 
          variant="dots" 
          gap={20} 
          size={1}
          color="#d1d5db"
        />
        
        {/* Контролы масштабирования */}
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        
        {/* Мини-карта */}
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'process') return '#3b82f6';
            if (node.id === selectedElement?.id) return '#ef4444';
            return '#6b7280';
          }}
          pannable
          zoomable
        />
        
        {/* Панель управления */}
        <Panel position="top-left">
          <div className="flow-panel">
            <div className="flow-panel-controls">
              <button 
                onClick={handleToggleProcessFlow}
                className={`flow-panel-btn ${showProcessFlow ? 'active' : ''}`}
              >
                {showProcessFlow ? '🔗' : '📦'} Workflow
              </button>
              <button onClick={handleFitView} className="flow-panel-btn">
                🔍 Fit View
              </button>
            </div>
            <div className="flow-panel-stats">
              <small>Узлов: {nodes.length} | Связей: {edges.length}</small>
            </div>
          </div>
        </Panel>


      </ReactFlow>
    </div>
  );
};

export default CanvasFlow;