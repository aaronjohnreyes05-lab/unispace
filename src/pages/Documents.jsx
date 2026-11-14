import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Search, Clock, Folder, Edit3, Download, Sparkles } from 'lucide-react';
import { Toast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getUserItem, setUserItem } from '../lib/userStorage';

export const Documents = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = getUserItem(userId, 'documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load documents', e);
    }
    return [
      { 
        id: 1, 
        title: 'Project Architecture Proposal', 
        category: 'Engineering', 
        content: '# Project Architecture Proposal\n\nUniSpace is built using a modular frontend architecture with React 18, Vite, and Tailwind CSS.\n\n- Zero backend server required\n- LocalStorage & IndexedDB persistence\n- Modular component structure', 
        updatedAt: '2 hours ago' 
      },
      { 
        id: 2, 
        title: 'Algorithms & Data Structures Study Notes', 
        category: 'Education', 
        content: '# Graph Algorithms\n\n- Breadth-First Search (BFS)\n- Depth-First Search (DFS)\n- Dijkstra\'s Shortest Path', 
        updatedAt: 'Yesterday' 
      }
    ];
  });

  const [activeDocId, setActiveDocId] = useState(documents[0]?.id || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  useEffect(() => {
    try {
      setUserItem(userId, 'documents', JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents', e);
    }
  }, [documents]);

  const handleCreateDoc = () => {
    const newDoc = {
      id: Date.now(),
      title: 'Untitled Document',
      category: 'General',
      content: '# Untitled Document\n\nStart writing your content here...',
      updatedAt: 'Just now'
    };
    setDocuments([newDoc, ...documents]);
    setActiveDocId(newDoc.id);
    setToast({ type: 'success', message: 'New document created.' });
  };

  const handleUpdateContent = (newContent) => {
    setDocuments(documents.map(d => {
      if (d.id === activeDocId) {
        return { ...d, content: newContent, updatedAt: 'Just now' };
      }
      return d;
    }));
  };

  const handleUpdateTitle = (newTitle) => {
    setDocuments(documents.map(d => {
      if (d.id === activeDocId) {
        return { ...d, title: newTitle, updatedAt: 'Just now' };
      }
      return d;
    }));
  };

  const handleDeleteDoc = (e, id) => {
    e.stopPropagation();
    if (documents.length <= 1) {
      setToast({ type: 'error', message: 'You must keep at least one document.' });
      return;
    }
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    if (activeDocId === id) {
      setActiveDocId(filtered[0].id);
    }
    setToast({ type: 'success', message: 'Document deleted.' });
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-7rem)] flex bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Left Sidebar: Document List */}
      <div className="w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-semibold text-sm text-white flex items-center space-x-2">
            <FileText size={16} className="text-indigo-400" />
            <span>Document Studio</span>
          </span>
          <button
            onClick={handleCreateDoc}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            title="New Document"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => setActiveDocId(doc.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs cursor-pointer transition-all group ${
                doc.id === activeDocId
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="space-y-1 truncate pr-2">
                <span className="font-semibold block truncate text-slate-200">{doc.title}</span>
                <span className="text-[10px] text-slate-500">{doc.updatedAt}</span>
              </div>
              <button
                onClick={(e) => handleDeleteDoc(e, doc.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Editor Area */}
      <div className="flex-1 flex flex-col bg-slate-900 min-w-0">
        {activeDoc ? (
          <>
            <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="bg-transparent font-bold text-base text-white focus:outline-none border-b border-transparent focus:border-indigo-500 pb-0.5 w-96"
              />
              <span className="text-xs text-slate-500">Autosaved locally</span>
            </div>
            <div className="flex-1 flex flex-col p-6">
              <textarea
                value={activeDoc.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                placeholder="Write markdown content..."
                className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none shadow-inner leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Select or create a document to start editing.
          </div>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};
