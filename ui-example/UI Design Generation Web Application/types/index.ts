export interface DesignElement {
  id: string;
  type: 'wireframe' | 'component' | 'section';
  name: string;
  prompt: string;
  code: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  children?: DesignElement[];
}

export interface Suggestion {
  id: string;
  text: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  hasArtifact?: boolean;
  artifactId?: string;
  suggestions?: Suggestion[];
}

export interface ProjectState {
  elements: DesignElement[];
  selectedElementId: string | null;
  chatMessages: ChatMessage[];
  canvasZoom: number;
  canvasOffset: { x: number; y: number };
  isGenerating: boolean;
}

export interface WireframeData {
  title: string;
  description: string;
  sections: {
    id: string;
    name: string;
    prompt: string;
    type: 'header' | 'hero' | 'content' | 'footer' | 'sidebar';
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[];
}