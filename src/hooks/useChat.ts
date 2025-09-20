import { useState, useCallback } from 'react';
import { CHAT_RESPONSES, INITIAL_CHAT_MESSAGES } from '../data/mockData';

export interface ChatMessage {
  id: number;
  sender: 'user' | 'sofia';
  text: string;
  timestamp: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [input, setInput] = useState('');

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Respuesta automática de Sofía
    setTimeout(() => {
      const sofiaResponse: ChatMessage = {
        id: messages.length + 2,
        sender: 'sofia',
        text: CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, sofiaResponse]);
    }, 1500);
  }, [input, messages.length]);

  const clearChat = useCallback(() => {
    setMessages(INITIAL_CHAT_MESSAGES);
  }, []);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    clearChat
  };
};
