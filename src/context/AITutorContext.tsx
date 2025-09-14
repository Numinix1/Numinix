import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  solution?: any;
}

interface AITutorContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultMessage: Message = {
  id: '1',
  content: "Hi! I'm your AI math tutor. Ask me any math topic and I'll provide step-by-step guide!",
  isUser: false,
};

const AITutorContext = createContext<AITutorContextType | undefined>(undefined);

export const AITutorProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AITutorContext.Provider value={{ messages, setMessages, input, setInput, loading, setLoading }}>
      {children}
    </AITutorContext.Provider>
  );
};

export const useAITutor = () => {
  const context = useContext(AITutorContext);
  if (!context) {
    throw new Error('useAITutor must be used within an AITutorProvider');
  }
  return context;
};
