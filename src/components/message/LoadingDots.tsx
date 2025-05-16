import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 py-2">
      <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "300ms" }} />
      <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "600ms" }} />
    </div>
  );
};

export default LoadingDots;
