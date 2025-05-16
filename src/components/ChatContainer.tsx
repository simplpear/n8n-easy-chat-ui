import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, Attachment, ChatSettings } from '../types';
import { generateId, saveMessages, getMessages } from '../utils';
import { useChatWebhook } from '../hooks/useChatWebhook';

interface ChatContainerProps {
  settings: ChatSettings;
  isConnected: boolean;
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  settings, 
  isConnected, 
  onCopyMessage, 
  onDownloadAttachment 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isLoading, sendMessageToWebhook } = useChatWebhook(
    settings.webhookUrl, 
    settings.chatId,
    settings.typingAnimation,
    settings.cloudflareAccessId,
    settings.clientSecret
  );
  
  // Load chat history from localStorage on mount
  useEffect(() => {
    // Load saved messages but make sure they don't have isTyping set
    const savedMessages = getMessages(settings.chatId).map(msg => ({
      ...msg,
      isTyping: false // Ensure loaded messages don't have typing animation
    }));
    
    if (savedMessages.length > 0) {
      console.log('Loaded messages:', savedMessages); // Debug log
      setMessages(savedMessages);
    } else {
      // Add a mock voice message if no messages are loaded
      const silentWavBase64 = 'UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      const byteCharacters = atob(silentWavBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const silentWavBlob = new Blob([byteArray], { type: 'audio/wav' });
      const mockAudioFile = new File([silentWavBlob], 'mock_voice.wav', { type: 'audio/wav' });

      const mockVoiceMessage: Message = {
        id: 'mock-voice-message-1',
        sender: 'user', // Or 'agent' to see the other side
        content: '', 
        timestamp: Date.now(),
        attachments: [
          {
            id: 'mock-audio-attachment-1',
            name: 'voice_recording.wav', 
            type: 'audio/wav',
            url: '', 
            source: 'microphone', 
            data: mockAudioFile // Use the File object with actual (silent) data
          }
        ],
      };
      setMessages([mockVoiceMessage]);
      console.log('Displaying mock voice message:', mockVoiceMessage);
    }
  }, [settings.chatId]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages, settings.chatId)
        .catch(error => console.error('Failed to save messages:', error));
    }
  }, [messages, settings.chatId]);

  const handleSendMessage = async (messageText: string, attachments: Attachment[]) => {
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      content: messageText.trim(),
      sender: 'user',
      timestamp: Date.now(),
      attachments
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // If we have a webhook URL, send the message
    if (settings.webhookUrl) {
      await sendMessageToWebhook(messageText, attachments, setMessages);
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MessageList 
        messages={messages}
        onCopyMessage={onCopyMessage}
        onDownloadAttachment={onDownloadAttachment}
      />
      
      <div className="z-10">
        <MessageInput 
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
