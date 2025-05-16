import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CopyButtonProps {
  position: 'left' | 'right';
  onClick: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ position, onClick }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          onClick={onClick} 
          variant="ghost" 
          size="icon"
          className="bg-chat-dark-secondary/80 hover:bg-gray-700 text-gray-400 hover:text-white p-1 h-auto w-auto rounded-full z-50 inline-flex" 
          aria-label="Copy message"
          style={{ 
            minWidth: 'auto', 
            lineHeight: 1,
            display: 'inline-flex',
            visibility: 'visible',
            opacity: 1,
            position: 'relative',
            zIndex: 100
          }}
        >
          <Copy size={14} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="py-1 px-2 text-xs w-fit">
        Copy message
      </HoverCardContent>
    </HoverCard>
  );
};

export default CopyButton;
