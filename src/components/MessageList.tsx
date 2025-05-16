import React, { useEffect, useRef } from 'react';
import { Message, Attachment } from '../types';
import MessageBubble from './message/MessageBubble';
import { ScrollArea } from './ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages = [], // Provide default empty array to prevent undefined error
  onCopyMessage,
  onDownloadAttachment
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <ScrollArea className="flex-1 relative">
      <div className="pt-20 pb-4 px-4 sm:px-8 md:px-[50px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div className="bg-white/5 p-6 rounded-lg shadow-md">
              <p className="mb-2 text-base font-medium text-gray-400">No messages yet</p>
              <p className="text-sm text-gray-500">Open the settings for configuration</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onCopyMessage={onCopyMessage} 
              onDownloadAttachment={onDownloadAttachment} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
