import { DesignElement } from '../types';

interface WireframeComponentProps {
  element: DesignElement;
}

export function WireframeComponent({ element }: WireframeComponentProps) {
  // Простой wireframe с основными секциями
  return (
    <div className="w-full h-full bg-background border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-muted border-b border-dashed border-muted-foreground/30 flex items-center px-4">
        <div className="w-24 h-6 bg-muted-foreground/20 rounded mr-auto"></div>
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-muted-foreground/20 rounded"></div>
          <div className="w-16 h-6 bg-muted-foreground/20 rounded"></div>
          <div className="w-16 h-6 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="h-32 bg-muted/50 border-b border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3">
        <div className="w-48 h-6 bg-muted-foreground/20 rounded"></div>
        <div className="w-32 h-4 bg-muted-foreground/15 rounded"></div>
        <div className="w-20 h-8 bg-muted-foreground/20 rounded"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-muted-foreground/10 rounded border border-dashed border-muted-foreground/20"></div>
          <div className="h-20 bg-muted-foreground/10 rounded border border-dashed border-muted-foreground/20"></div>
          <div className="h-20 bg-muted-foreground/10 rounded border border-dashed border-muted-foreground/20"></div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-muted-foreground/15 rounded"></div>
          <div className="w-4/5 h-3 bg-muted-foreground/15 rounded"></div>
          <div className="w-3/4 h-3 bg-muted-foreground/15 rounded"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 bg-muted border-t border-dashed border-muted-foreground/30 flex items-center justify-center">
        <div className="w-32 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    </div>
  );
}