
import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Plus, Trash2, Bot, User,
  MessageSquare, ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSimulatedAIResponse } from '../modules/ai/aiAssistantService';
import { Toast } from '../components/common/Toast';

export const AIWorkspace = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('unispace_ai_conversations');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (error) {
        console.error('Invalid AI conversation history:', error);
      }
    }

    return [
      {
        id: 'conv-1',
        title: 'React Architecture & State',
        messages: [
          {
            role: 'user',
            content: 'Can you give me best practices for React component structure?',
            timestamp: '10:00 AM'
          },
          {
            role: 'assistant',
            content: '### React Architecture Best Practices\n\nWhen building scalable React applications without a backend, structuring your components cleanly is essential:\n\n1. **Lift State Up wisely**\n2. **Custom Hooks**\n3. **Component Modularity**',
            timestamp: '10:01 AM'
          }
        ]
      }
    ];
  });

  const [activeConvId, setActiveConvId] = useState(() => {
    const saved = localStorage.getItem('unispace_ai_conversations');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (error) {
        console.error('Invalid AI conversation history:', error);
      }
    }

    return 'conv-1';
  });

  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      'unispace_ai_conversations',
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isGenerating]);

  const activeConv = conversations.find(
    conversation => conversation.id === activeConvId
  ) || conversations[0];

  const handleCreateNewChat = () => {
    const newConv = {
      id: `conv-${Date.now()}`,
      title: 'New AI Chat',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I am your UniSpace AI assistant. How can I help you learn or build today?',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const handleDeleteChat = (event, id) => {
    event.stopPropagation();

    if (conversations.length <= 1) {
      setToast({
        type: 'error',
        message: 'You must keep at least one conversation.'
      });
      return;
    }

    const updated = conversations.filter(
      conversation => conversation.id !== id
    );

    setConversations(updated);

    if (activeConvId === id) {
      setActiveConvId(updated[0].id);
    }

    setToast({
      type: 'success',
      message: 'Conversation deleted.'
    });
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();

    if (!text || isGenerating || !activeConv) return;

    const targetConvId = activeConvId;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setConversations(prev => prev.map(conversation => {
      if (conversation.id !== targetConvId) return conversation;

      const isDefaultTitle = conversation.title === 'New AI Chat';

      return {
        ...conversation,
        title: isDefaultTitle
          ? text.slice(0, 28) + (text.length > 28 ? '...' : '')
          : conversation.title,
        messages: [...conversation.messages, userMsg]
      };
    }));

    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      const aiReply = getSimulatedAIResponse(text);

      const assistantMsg = {
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setConversations(prev => prev.map(conversation => {
        if (conversation.id !== targetConvId) return conversation;

        return {
          ...conversation,
          messages: [...conversation.messages, assistantMsg]
        };
      }));

      setIsGenerating(false);
    }, 800);
  };

  const suggestedPrompts = [
    'Explain React state management & custom hooks',
    'How to optimize SQL query performance?',
    'Create a study plan for algorithms & data structures'
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

      {/* Conversation Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-950/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-semibold text-sm text-white flex items-center space-x-2">
            <Sparkles size={16} className="text-indigo-400" />
            <span>AI Studio Chats</span>
          </span>

          <button
            onClick={handleCreateNewChat}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium cursor-pointer transition-all group ${
                conv.id === activeConvId
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center space-x-3 truncate min-w-0">
                <MessageSquare
                  size={16}
                  className={conv.id === activeConvId ? 'text-indigo-400' : 'text-slate-500'}
                />
                <span className="truncate">{conv.title}</span>
              </div>

              <button
                onClick={(event) => handleDeleteChat(event, conv.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-opacity"
                title="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 min-w-0">
        <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
              <Bot size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-sm text-white">
                {activeConv?.title || 'AI Workspace'}
              </h3>
              <span className="text-[10px] text-cyan-400">
                Demo AI Assistant • Frontend Mode
              </span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeConv?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-4 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed min-w-0 max-w-full ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                )}

                <span className={`block text-[10px] mt-2 ${
                  msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center border border-slate-700">
                <Bot size={16} />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AI is generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts and Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3 shrink-0">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 text-xs whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
              >
                <span>{prompt}</span>
                <ArrowRight size={12} className="text-indigo-400" />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 focus-within:border-indigo-500 transition-colors shadow-inner">
            <input
              type="text"
              placeholder="Ask anything or prompt the AI workspace..."
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
              className="flex-1 min-w-0 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isGenerating}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
