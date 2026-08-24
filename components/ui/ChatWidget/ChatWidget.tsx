'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatWidget.module.css';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am the BenchAtlas AI assistant. Ask me anything about ML benchmarks, research papers, or model capabilities.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send the conversation history (excluding errors)
      const chatHistory = messages
        .filter((m) => m.role !== 'error')
        .map((m) => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatHistory, { role: 'user', content: userMessage.content }] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'error',
          content: err.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.widget_container}>
      {/* The Chat Panel */}
      <div className={`${styles.chat_panel} ${isOpen ? styles.chat_panel_open : ''}`} aria-hidden={!isOpen}>
        <div className={styles.panel_header}>
          <div className={styles.header_title}>
            <Bot size={18} />
            Research Assistant
          </div>
          <button onClick={() => setIsOpen(false)} className={styles.close_button} aria-label="Close chat">
            <X size={18} />
          </button>
        </div>

        <div className={styles.message_list}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.message} ${
                m.role === 'user'
                  ? styles.message_user
                  : m.role === 'error'
                  ? styles.message_error
                  : styles.message_assistant
              }`}
            >
              {m.role === 'assistant' ? (
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.message_assistant}`}>
              <div className={styles.loading_dots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.input_area}>
          <form onSubmit={handleSubmit} className={styles.input_form}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a benchmark..."
              className={styles.input_field}
              disabled={isLoading}
            />
            <button type="submit" className={styles.send_button} disabled={!input.trim() || isLoading} aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* The Floating Button */}
      <button
        className={styles.chat_button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        style={{ transform: isOpen ? 'scale(0) opacity(0)' : '' }}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
