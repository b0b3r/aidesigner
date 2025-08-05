import { Button } from './ui/button';
import { Suggestion } from '../types';

interface SuggestionButtonsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (value: string) => void;
  disabled?: boolean;
}

export function SuggestionButtons({ 
  suggestions, 
  onSuggestionClick, 
  disabled = false 
}: SuggestionButtonsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion.value)}
          disabled={disabled}
          className="text-left h-auto py-2 px-3 rounded-lg border-muted-foreground/20 hover:border-primary hover:bg-accent/50 transition-colors"
        >
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
}