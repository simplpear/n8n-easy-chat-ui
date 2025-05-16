import React, { useState, useEffect, useRef } from 'react';
import { X, Smile, Info } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme as EmojiTheme } from 'emoji-picker-react';
import { ChatSettings } from '../types';
import { exportChatHistory, clearChatHistory } from '../utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
  chatId: string;
  onImportChat: (file: File) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSaveSettings,
  chatId,
  onImportChat
}) => {
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [typingAnimation, setTypingAnimation] = useState(settings.typingAnimation);
  const [chatName, setChatName] = useState(settings.chatName || 'Chat');
  const [emoji, setEmoji] = useState(settings.emoji || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cloudflareAccessId, setCloudflareAccessId] = useState(settings.cloudflareAccessId);
  const [clientSecret, setClientSecret] = useState(settings.clientSecret);
  const [isClosing, setIsClosing] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setWebhookUrl(settings.webhookUrl);
    setTypingAnimation(settings.typingAnimation);
    setChatName(settings.chatName || 'Chat');
    setEmoji(settings.emoji || '');
    setCloudflareAccessId(settings.cloudflareAccessId);
    setClientSecret(settings.clientSecret);
    setShowEmojiPicker(false);
  }, [settings, isOpen]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);
  
  const handleInitiateClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };
  
  const handleSave = () => {
    onSaveSettings({
      ...settings,
      webhookUrl,
      typingAnimation,
      chatName: chatName || 'Chat',
      emoji,
      cloudflareAccessId,
      clientSecret
    });
    setShowEmojiPicker(false);
    handleInitiateClose();
  };
  
  const handleExportChat = () => {
    exportChatHistory(chatId);
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
      clearChatHistory(chatId);
      window.location.reload();
    }
  };
  
  const handleImportChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportChat(e.target.files[0]);
    }
  };
  
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
      isClosing ? 'animate-fade-out' : 'animate-fade-in'
    }`}>
      <div className={`bg-chat-dark-secondary rounded-xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/5 ${
        isClosing ? 'animate-bounce-out' : 'animate-bounce-in'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800/60">
          <h2 className="text-base font-medium text-gray-400">Settings</h2>
          <button 
            onClick={handleInitiateClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatName" className="text-gray-300">
                Chat Name
              </Label>
              <div className="flex items-center space-x-2 relative">
                <div ref={emojiPickerRef} className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500 w-12 h-10 flex items-center justify-center p-0"
                    aria-label="Select emoji"
                  >
                    {emoji ? (
                      <span className="text-xl">{emoji}</span>
                    ) : (
                      <Smile size={20} className="text-gray-400" />
                    )}
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute top-full mt-2 z-50">
                      <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                        autoFocusSearch={false}
                        theme={EmojiTheme.DARK}
                        lazyLoadEmojis={true}
                        height={350}
                        width={300}
                        searchPlaceholder="Search emoji"
                        previewConfig={{showPreview: false}}
                      />
                    </div>
                  )}
                </div>
                <Input
                  id="chatName"
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500 flex-1"
                  placeholder="Chat"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl" className="text-gray-300">
                n8n Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Enter production webhook link"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Label htmlFor="cloudflareAccessId" className="text-gray-300">
                  Cloudflare Access ID
                </Label>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="h-auto w-auto p-0.5 text-gray-400 hover:text-white hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                        <Info size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/70 backdrop-blur-sm text-white text-xs p-2 max-w-xs shadow-lg rounded-md border-0">
                      <p>To securely connect to your agent via a Cloudflare-protected domain, add a security bypass policy and enter your client ID and secret in the settings. This ensures your n8n instance is protected, and only you can use it.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="cloudflareAccessId"
                type="text"
                value={cloudflareAccessId}
                onChange={(e) => setCloudflareAccessId(e.target.value)}
                className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Enter your Cloudflare Access ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret" className="text-gray-300">
                Client Secret (Optional)
              </Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Enter your Client Secret"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="typingAnimation"
                checked={typingAnimation}
                onCheckedChange={(checked) => setTypingAnimation(checked as boolean)} 
                className="data-[state=checked]:bg-chat-accent border-gray-600"
              />
              <Label htmlFor="typingAnimation" className="text-gray-300">
                Enable typing animation
              </Label>
            </div>
          </div>
          
          <Separator className="bg-gray-800/60" />
          
          <div className="flex items-center justify-between"> 
            <h3 className="text-sm font-medium text-gray-300">Chat History</h3>
            <div className="flex space-x-2"> 
              <Button
                onClick={handleExportChat}
                variant="outline"
                className="bg-transparent border-gray-700 text-white hover:bg-gray-800/50 hover:text-white px-3 py-1 text-xs"
              >
                Export
              </Button>
              
              <Button
                onClick={handleClearChat}
                variant="outline"
                className="bg-transparent border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-900/50 px-3 py-1 text-xs"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800/60">
          <div className="flex space-x-3">
              <Button
                onClick={handleInitiateClose}
                variant="outline"
                className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800/50 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-chat-accent hover:bg-chat-accent-hover text-white"
              >
                Save
              </Button>
          </div>
          <div className="text-xs text-gray-400 mt-4 text-center">
            Created by <a href="https://www.threads.com/@simplpear" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-chat-accent transition-colors">@simplpear</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
