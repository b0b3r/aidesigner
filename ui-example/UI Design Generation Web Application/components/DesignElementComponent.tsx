import { useState } from 'react';
import { DesignElement } from '../types';
import { WireframeComponent } from './WireframeComponent';

interface DesignElementComponentProps {
  element: DesignElement;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

export function DesignElementComponent({
  element,
  isSelected,
  onSelect,
  onMouseDown,
  isDragging,
}: DesignElementComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Клик уже обрабатывается в onMouseDown, не нужно дублировать
  };

  return (
    <div
      className={`absolute transition-all duration-150 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      } ${isHovered && !isDragging ? 'shadow-lg' : ''} ${
        isDragging ? 'opacity-80 shadow-2xl z-50' : 'z-auto'
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'all 0.15s ease',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection handles */}
      {isSelected && !isDragging && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-primary rounded-full border border-background" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-primary rounded-full border border-background" />
        </>
      )}

      {/* Element content */}
      <div className="w-full h-full relative">
        {element.type === 'wireframe' && (
          <WireframeComponent element={element} />
        )}
        {element.type === 'component' && (
          <div className="w-full h-full bg-card border border-border rounded-lg p-4 flex items-center justify-center shadow-sm">
            <span className="text-muted-foreground">{element.name}</span>
          </div>
        )}
        {element.type === 'section' && (
          <div className="w-full h-full bg-accent/50 border border-border rounded-lg p-4 flex items-center justify-center">
            <span className="text-muted-foreground">{element.name}</span>
          </div>
        )}
      </div>

      {/* Element label */}
      {(isSelected || isHovered || isDragging) && (
        <div className="absolute -top-8 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs whitespace-nowrap z-20 shadow-lg">
          {element.name}
          {isDragging && (
            <span className="ml-2 opacity-70">
              {Math.round(element.position.x)}, {Math.round(element.position.y)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}