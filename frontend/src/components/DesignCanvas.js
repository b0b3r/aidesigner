import React, { useRef, useState, useCallback } from 'react';

const DesignCanvas = ({ 
  elements, 
  selectedElement, 
  onElementSelect, 
  onCanvasClick 
}) => {
  const canvasRef = useRef(null);
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1 });

  const handleElementClick = useCallback((e, element) => {
    e.stopPropagation();
    onElementSelect(element);
  }, [onElementSelect]);

  const handleCanvasClickInternal = useCallback((e) => {
    if (e.target === canvasRef.current) {
      onCanvasClick();
    }
  }, [onCanvasClick]);

  const resetView = useCallback(() => {
    setCanvasTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return (
    <div className="canvas-container">
      {/* Панель управления */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white rounded-lg shadow-md p-2">
        <button onClick={resetView} className="btn btn-ghost text-sm">
          🔍 Сбросить
        </button>
        <div className="text-sm text-gray-500 px-2 py-1">
          {Math.round(canvasTransform.scale * 100)}%
        </div>
      </div>

      {/* Основной канвас */}
      <div
        ref={canvasRef}
        className="w-full h-full overflow-hidden cursor-default"
        onClick={handleCanvasClickInternal}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})`,
            width: '2000px',
            height: '2000px'
          }}
        >
          {/* Рендер элементов */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute border-2 cursor-pointer transition-all ${
                selectedElement?.id === element.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                left: element.x || 100,
                top: element.y || 100,
                width: element.width || 200,
                height: element.height || 'auto',
                minHeight: element.height || 100
              }}
              onClick={(e) => handleElementClick(e, element)}
            >
              <div className="w-full h-full overflow-hidden">
                {element.type === 'html' ? (
                  <div dangerouslySetInnerHTML={{ __html: element.content }} />
                ) : (
                  <div className="p-4 text-sm">{element.content}</div>
                )}
              </div>
              
              {selectedElement?.id === element.id && (
                <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  Выбран
                </div>
              )}
            </div>
          ))}

          {/* Сообщение для пустого канваса */}
          {elements.length === 0 && (
            <div className="absolute text-center text-gray-400" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <div className="text-6xl mb-4">🎨</div>
              <div className="text-lg mb-2">Канвас пуст</div>
              <div className="text-sm">Начните диалог с ИИ для создания дизайна</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;