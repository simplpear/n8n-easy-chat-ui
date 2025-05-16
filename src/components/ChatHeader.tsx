import React from 'react';
import { Settings } from 'lucide-react';
import { ChatSettings } from '../types';

interface ChatHeaderProps {
  settings: ChatSettings;
  isConnected: boolean;
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  settings, 
  isConnected, 
  onOpenSettings 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <div className="flex items-center">
        {settings.emoji && <span className="mr-2 text-lg">{settings.emoji}</span>}
        <h2 className="text-white font-normal truncate">
          {settings.chatName}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium
          ${isConnected 
            ? 'bg-[#326263]/50 text-cyan-400'  // Changed /70 to /50 for opacity
            : 'bg-[#633232]/50 text-red-400'    // Changed /70 to /50 for opacity
          }
        `}>
          <span className={`inline-block w-2 h-2 rounded-full 
            ${isConnected ? 'bg-cyan-400' : 'bg-red-400'} 
          `}/>
          <span className="hidden sm:inline">
            {isConnected ? 'N8N CONNECTED' : 'NO CONNECTION'}
          </span>
        </div>
        
        <button 
          onClick={onOpenSettings}
          className="text-gray-400 hover:text-white p-1 rounded-full"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
