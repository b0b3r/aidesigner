import { useCallback, useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Hand, Move } from 'lucide-react';
import { Button } from './ui/button';
import { DesignElement } from '../types';
import { DesignElementComponent } from './DesignElementComponent';

interface CanvasProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementPosition: (id: string, position: { x: number; y: number }) => void;
  zoom: number;
  offset: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (offset: { x: number; y: number }) => void;
}

export function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  zoom,
  offset,
  onZoomChange,
  onOffsetChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Состояние для панорамирования
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panButton, setPanButton] = useState<number | null>(null);
  
  // Состояние для перетаскивания элементов
  const [isDragging, setIsDragging] = useState(false);
  const [dragElementId, setDragElementId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / zoom;
    const y = (clientY - rect.top - offset.y) / zoom;
    
    return { x, y };
  }, [offset, zoom]);

  // Обработка колеса мыши - только зум
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY * -0.002;
    const newZoom = Math.min(Math.max(0.1, zoom * (1 + delta)), 5);
    
    // Зум к курсору
    const zoomFactor = newZoom / zoom;
    const newOffsetX = mouseX - (mouseX - offset.x) * zoomFactor;
    const newOffsetY = mouseY - (mouseY - offset.y) * zoomFactor;
    
    onZoomChange(newZoom);
    onOffsetChange({ x: newOffsetX, y: newOffsetY });
  }, [zoom, offset, onZoomChange, onOffsetChange]);

  // Начало взаимодействия с канвасом
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Проверяем, что клик был именно на канвасе, а не на элементе
    if (target === canvasRef.current || target === containerRef.current) {
      if (e.button === 0) {
        // Левая кнопка - снимаем выделение и начинаем панорамирование
        onSelectElement(null);
        setIsPanning(true);
        setPanButton(0);
        setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      } else if (e.button === 1) {
        // Средняя кнопка - панорамирование без снятия выделения
        e.preventDefault();
        setIsPanning(true);
        setPanButton(1);
        setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      }
    }
  }, [offset, onSelectElement]);

  // Движение мыши
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && !isDragging) {
      // Панорамирование канваса
      const newOffset = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      };
      onOffsetChange(newOffset);
    } else if (isDragging && dragElementId) {
      // Перетаскивание элемента
      const canvasCoords = getCanvasCoordinates(e.clientX, e.clientY);
      setDragOffset({
        x: canvasCoords.x - dragStart.x,
        y: canvasCoords.y - dragStart.y,
      });
    }
  }, [isPanning, isDragging, dragElementId, panStart, dragStart, onOffsetChange, getCanvasCoordinates]);

  // Окончание взаимодействия
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragElementId) {
      // Завершаем перетаскивание элемента
      const element = elements.find(el => el.id === dragElementId);
      if (element) {
        onUpdateElementPosition(dragElementId, {
          x: Math.round(element.position.x + dragOffset.x),
          y: Math.round(element.position.y + dragOffset.y),
        });
      }
      setIsDragging(false);
      setDragElementId(null);
      setDragOffset({ x: 0, y: 0 });
    }
    
    if (isPanning) {
      setIsPanning(false);
      setPanButton(null);
    }
  }, [isDragging, dragElementId, elements, dragOffset, onUpdateElementPosition, isPanning]);

  // Обработка начала перетаскивания элемента
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (e.button === 0) {
      // Левая кнопка на элементе - выделение и начало перетаскивания
      const canvasCoords = getCanvasCoordinates(e.clientX, e.clientY);
      
      onSelectElement(elementId);
      setIsDragging(true);
      setDragElementId(elementId);
      setDragStart(canvasCoords);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [onSelectElement, getCanvasCoordinates]);

  // Глобальные обработчики для завершения взаимодействий
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        setPanButton(null);
      }
      if (isDragging) {
        setIsDragging(false);
        setDragElementId(null);
        setDragOffset({ x: 0, y: 0 });
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning && !isDragging) {
        const newOffset = {
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        };
        onOffsetChange(newOffset);
      } else if (isDragging && dragElementId) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const canvasX = (e.clientX - rect.left - offset.x) / zoom;
          const canvasY = (e.clientY - rect.top - offset.y) / zoom;
          setDragOffset({
            x: canvasX - dragStart.x,
            y: canvasY - dragStart.y,
          });
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isPanning || isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isPanning, isDragging, panStart, dragStart, dragElementId, onOffsetChange, offset, zoom]);

  // Клавиатурные сокращения
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectElement]);

  // Кнопки управления
  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 5);
    onZoomChange(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    onZoomChange(newZoom);
  };

  const zoomToFit = () => {
    if (elements.length === 0) {
      onZoomChange(1);
      onOffsetChange({ x: 0, y: 0 });
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    elements.forEach(el => {
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + el.size.width);
      maxY = Math.max(maxY, el.position.y + el.size.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const padding = 100;

    const scaleX = (rect.width - padding * 2) / contentWidth;
    const scaleY = (rect.height - padding * 2) / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 2);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const newOffsetX = rect.width / 2 - centerX * newZoom;
    const newOffsetY = rect.height / 2 - centerY * newZoom;

    onZoomChange(newZoom);
    onOffsetChange({ x: newOffsetX, y: newOffsetY });
  };

  const resetView = () => {
    onZoomChange(1);
    onOffsetChange({ x: 200, y: 100 });
  };

  const getCursor = () => {
    if (isDragging) return 'grabbing';
    if (isPanning) return panButton === 1 ? 'grabbing' : 'grabbing';
    return 'default';
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-muted/30 select-none"
      style={{ cursor: getCursor() }}
    >
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 bg-background border border-border rounded-lg p-2 flex gap-1 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          className="w-8 h-8 p-0"
          title="Увеличить"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          className="w-8 h-8 p-0"
          title="Уменьшить"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomToFit}
          className="w-8 h-8 p-0"
          title="Показать все"
        >
          <Move className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="w-8 h-8 p-0"
          title="Сброс"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <div className="px-2 py-1 text-muted-foreground border-l border-border ml-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 border border-border rounded-lg px-3 py-2 text-muted-foreground">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4" />
            <span>Средняя кнопка: панорамирование</span>
          </div>
          <div>Колесо: масштаб • Escape: снять выделение</div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Infinite Grid */}
          <div 
            className="absolute opacity-20 pointer-events-none"
            style={{
              left: -offset.x / zoom - 2000,
              top: -offset.y / zoom - 2000,
              width: 6000,
              height: 6000,
            }}
          >
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0"
            >
              <defs>
                <pattern
                  id="smallGrid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path
                    d="M 100 0 L 0 0 0 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Elements */}
          {elements.map((element) => (
            <DesignElementComponent
              key={element.id}
              element={{
                ...element,
                position: isDragging && dragElementId === element.id 
                  ? {
                      x: element.position.x + dragOffset.x,
                      y: element.position.y + dragOffset.y,
                    }
                  : element.position
              }}
              isSelected={selectedElementId === element.id}
              onSelect={onSelectElement}
              onMouseDown={(e) => handleElementMouseDown(e, element.id)}
              isDragging={isDragging && dragElementId === element.id}
            />
          ))}

          {/* Empty State */}
          {elements.length === 0 && (
            <div 
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: -offset.x / zoom + 100,
                top: -offset.y / zoom + 100,
                width: 400,
                height: 300,
              }}
            >
              <div className="text-center text-muted-foreground">
                <Hand className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Начните диалог с ассистентом</p>
                <p>для создания дизайна</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}