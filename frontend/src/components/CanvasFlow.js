import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeResizer,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { makeElementsSelectable } from '../utils/htmlParser';

// Кастомный узел для UI компонента
const UIComponentNode = React.memo(({ data, selected, id }) => {
  const contentRef = useRef(null);
  const [hoveredElementId, setHoveredElementId] = useState(null);
  
  const nodeStyle = {
    width: data.width ? `${data.width}px` : 'auto',
    height: data.height ? `${data.height}px` : 'auto',
    minWidth: data.width ? `${data.width}px` : '200px',
    minHeight: data.height ? `${data.height}px` : 'auto'
  };
  
  // Санитизируем HTML и добавляем data-атрибуты для интерактивности
  const selectableContent = useMemo(() => {
    if (!data.content) return '';
    const sanitized = DOMPurify.sanitize(data.content, {
      ALLOW_DATA_ATTR: true,
      ADD_ATTR: ['style', 'role', 'aria-label', 'aria-hidden', 'aria-expanded', 'aria-controls']
    });
    return makeElementsSelectable(sanitized);
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

  // Добавляем event listeners после рендера + инициализируем MDC компоненты
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

    // Инициализируем Material Design компоненты для динамически созданного контента
    if (typeof window.initializeMDC === 'function') {
      window.initializeMDC();
      console.log('🔄 MDC компоненты переинициализированы для артефакта:', data.id);
    } else if (typeof window.mdc !== 'undefined') {
      window.mdc.autoInit();
      console.log('🔄 MDC компоненты автоинициализированы для артефакта:', data.id);
    }

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
    <div className={`ui-flow-node ${selected ? 'selected' : ''} ${data.isResizing ? 'resizing' : ''}`} style={nodeStyle}>
      {/* Добавляем NodeResizer для изменения размера */}
      <NodeResizer
        isVisible={selected || data.isResizing}
        minWidth={100}
        minHeight={50}
        onResizeStart={(event, params) => {
          console.log('🎯 Начало изменения размера через NodeResizer:', data.id);
        }}
        onResize={(event, params) => {
          console.log('📏 Изменение размера через NodeResizer:', data.id, params);
        }}
        onResizeStop={(event, params) => {
          console.log('✅ Завершение изменения размера через NodeResizer:', data.id, params);
        }}
      />
      
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
              position: 'relative',

            }}
          />
        ) : (
          <div className="ui-flow-text">{data.name || 'Пустой элемент'}</div>
        )}
      </div>
      
      {/* Показываем информацию о выбранном внутреннем элементе */}
      {data.selectedInternalElement && (
        <div className="selected-element-indicator">
          🎯 {data.selectedInternalElement}
        </div>
      )}

    </div>
  );
});

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
  // Состояние для отслеживания процесса изменения размера
  const [resizingNodeId, setResizingNodeId] = useState(null);

  // Конвертируем существующие элементы в React Flow узлы
  const convertToFlowNodes = useCallback((elements) => {
    return elements.map((element) => {
      const nodeWidth = element.width || 200;
      const nodeHeight = element.height === 'auto' ? undefined : (element.height || 150);
      
      console.log('🔄 Конвертируем элемент в узел:', element.id, 'размеры:', { width: nodeWidth, height: nodeHeight });
      
      return {
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
          isResizing: resizingNodeId === element.id,

          selectedInternalElement: selectedInternalElement?.artifactId === element.id ? selectedInternalElement.elementId : null,
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
        }
      };
    });
  }, [onElementRegenerate, onElementEdit, onInternalElementSelect, selectedInternalElement, resizingNodeId]);

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
  // Throttle обновление позиций в родительском состоянии (один раз за кадр)
  const pendingUpdatesRef = useRef({});
  const rafRef = useRef(0);

  const flushPendingUpdates = useCallback(() => {
    if (!onElementUpdate) return;
    const pending = pendingUpdatesRef.current;
    pendingUpdatesRef.current = {};
    Object.entries(pending).forEach(([id, pos]) => {
      onElementUpdate(id, pos);
    });
    rafRef.current = 0;
  }, [onElementUpdate]);

  const onNodesChange = useCallback((changes) => {
    originalOnNodesChange(changes);
    changes.forEach((change) => {
      if (change.type === 'position' && change.position && change.id) {
        pendingUpdatesRef.current[change.id] = {
          x: Math.round(change.position.x),
          y: Math.round(change.position.y)
        };
        if (rafRef.current === 0) {
          rafRef.current = requestAnimationFrame(flushPendingUpdates);
        }
      }
      // Обрабатываем изменения размера через onNodesChange
      if (change.type === 'dimensions' && change.dimensions && change.id) {
        console.log('📏 Изменение размера через onNodesChange:', change.id, change.dimensions);
        if (onElementUpdate) {
          onElementUpdate(change.id, {
            width: Math.round(change.dimensions.width),
            height: Math.round(change.dimensions.height)
          });
        }
      }
    });
  }, [originalOnNodesChange, flushPendingUpdates, onElementUpdate]);

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
        onPaneClick={(event) => {
          // При клике на пустую область завершаем изменение размера
          if (resizingNodeId) {
            console.log('🖱️ Клик на пустую область - завершение изменения размера для узла:', resizingNodeId);
            setResizingNodeId(null);
            // Размеры уже сохранены через onNodesChange
          }
        }}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView={false}
        onNodeResizeStart={(event, node) => {
          console.log('🚀 Начало изменения размера узла:', node.id);
          setResizingNodeId(node.id);
        }}
        onNodeResizeStop={(event, node) => {
          console.log('✅ Завершение изменения размера узла:', node.id);
          setResizingNodeId(null);
        }}
        resizeOnScroll={false}
        zoomOnScroll={true}
        panOnScroll={false}
        zoomOnPinch={true}
        panOnDrag={true}
        nodeResizable={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
        onKeyDown={(event) => {
          // Обработка клавиши Escape для завершения изменения размера
          if (event.key === 'Escape' && resizingNodeId) {
            console.log('⌨️ Escape - завершение изменения размера для узла:', resizingNodeId);
            setResizingNodeId(null);
            // Размеры уже сохранены через onNodesChange
          }
        }}
      >
        {/* Сетка из точек */}
        <Background 
          variant="dots" 
          gap={25} 
          size={3}
          color="hsl(var(--muted-foreground) / 0.2)"
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
        

      </ReactFlow>
    </div>
  );
};

export default CanvasFlow;