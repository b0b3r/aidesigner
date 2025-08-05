import React, { useState, useCallback, useMemo } from 'react';
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

// Кастомный узел для UI компонента
const UIComponentNode = ({ data, selected }) => {
  const nodeStyle = {
    width: data.width ? `${data.width}px` : 'auto',
    height: data.height ? `${data.height}px` : 'auto',
    minWidth: data.width ? `${data.width}px` : '200px',
    minHeight: data.height ? `${data.height}px` : 'auto'
  };
  
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
            dangerouslySetInnerHTML={{ __html: data.content }}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              fontSize: '12px'
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
  onElementEdit 
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
      },
      style: {
        width: element.width || 200,
        height: element.height === 'auto' ? undefined : (element.height || 150),
      }
    }));
  }, [onElementRegenerate, onElementEdit]);

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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Обновляем узлы при изменении элементов
  React.useEffect(() => {
    const uiNodes = convertToFlowNodes(elements);
    const newNodes = showProcessFlow ? [...processNodes, ...uiNodes] : uiNodes;
    setNodes(newNodes);
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
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
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