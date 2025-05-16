export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: number;
  attachments?: Attachment[];
  isTyping?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url?: string;  // URL property for persisted files
  data?: File;
  size?: number;
  previewUrl?: string;
}

export interface ChatSettings {
  webhookUrl: string;
  typingAnimation: boolean;
  chatId: string;
  chatName: string;
  emoji?: string;
  cloudflareAccessId: string;
  clientSecret: string;
}

export interface ChatHistoryData {
  id: string;
  name: string;
  messages: Message[];
  settings: ChatSettings;
}
