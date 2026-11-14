import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Layers, CheckSquare, Plus, Trash2, Edit3, Check, X, Award, Search, ArrowRight } from 'lucide-react';
import { Toast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getUserItem, setUserItem } from '../lib/userStorage';

export const Education = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'flashcards' | 'quiz' | 'assignments'
  const [toast, setToast] = useState(null);

  // --- 1. Notes State ---
  const [notes, setNotes] = useState(() => {
    const saved = getUserItem(userId, 'edu_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Data Structures & Algorithms', category: 'CS', content: 'Key concepts: Big O notation, Hash Maps, Trees, Graph traversal (BFS/DFS).', updatedAt: 'Yesterday' }
    ];
  });
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('General');

  // --- 2. Flashcards State ---
  const [flashcards, setFlashcards] = useState(() => {
    const saved = getUserItem(userId, 'edu_flashcards');
    return saved ? JSON.parse(saved) : [
      { id: 1, question: 'What is the time complexity of binary search?', answer: 'O(log n)', status: 'mastered' },
      { id: 2, question: 'What does CSS stand for?', answer: 'Cascading Style Sheets', status: 'learning' }
    ];
  });
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  // --- 3. Quiz State ---
  const [quizQuestions] = useState([
    {
      id: 1,
      question: 'Which hook in React is used for managing component state?',
      options: ['useEffect', 'useState', 'useContext', 'useRef'],
      correct: 1
    },
    {
      id: 2,
      question: 'What does DOM stand for?',
      options: ['Document Object Model', 'Data Oriented Module', 'Digital Object Management', 'Dynamic Operational Method'],
      correct: 0
    },
    {
      id: 3,
      question: 'Which CSS property controls text color in Tailwind?',
      options: ['font-color', 'color', 'text', 'foreground'],
      correct: 1
    }
  ]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- 4. Assignment Tracker State ---
  const [assignments, setAssignments] = useState(() => {
    const saved = getUserItem(userId, 'edu_assignments');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Full Stack React Project', dueDate: '2026-06-15', priority: 'High', completed: false },
      { id: 2, title: 'Database Schema Design', dueDate: '2026-06-20', priority: 'Medium', completed: true }
    ];
  });
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDate, setNewAssignDate] = useState('');
  const [newAssignPriority, setNewAssignPriority] = useState('Medium');

  useEffect(() => {
    setUserItem(userId, 'edu_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setUserItem(userId, 'edu_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    setUserItem(userId, 'edu_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Handlers
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const note = { id: Date.now(), title: newNoteTitle, category: newNoteCategory, content: newNoteContent, updatedAt: 'Just now' };
    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setToast({ type: 'success', message: 'Note created successfully.' });
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    setToast({ type: 'success', message: 'Note deleted.' });
  };

  const handleAddFlashcard = (e) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    setFlashcards([...flashcards, { id: Date.now(), question: newQ, answer: newA, status: 'learning' }]);
    setNewQ('');
    setNewA('');
    setToast({ type: 'success', message: 'Flashcard added.' });
  };

  const handleAnswerQuiz = (optIdx) => {
    setSelectedOption(optIdx);
    if (optIdx === quizQuestions[quizIndex].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!newAssignTitle.trim()) return;
    setAssignments([...assignments, { id: Date.now(), title: newAssignTitle, dueDate: newAssignDate || '2026-12-31', priority: newAssignPriority, completed: false }]);
    setNewAssignTitle('');
    setToast({ type: 'success', message: 'Assignment added.' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <GraduationCap className="text-indigo-400" size={26} />
            <span>Education Center</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Master subjects with digital notes, flashcards, quizzes, and assignment tracking.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {[
            { id: 'notes', label: 'Notes', icon: BookOpen },
            { id: 'flashcards', label: 'Flashcards', icon: Layers },
            { id: 'quiz', label: 'Quizzes', icon: Award },
            { id: 'assignments', label: 'Assignments', icon: CheckSquare },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-lg text-white">Create New Note</h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={4}
                  placeholder="Write note content..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                Save Note
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-white">Saved Notes ({notes.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {note.category}
                      </span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold text-base text-white">{note.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{note.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-6 block pt-3 border-t border-slate-800/80">Updated {note.updatedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-lg text-white">Add Flashcard</h3>
            <form onSubmit={handleAddFlashcard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Question</label>
                <input
                  type="text"
                  placeholder="Enter question..."
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Answer</label>
                <input
                  type="text"
                  placeholder="Enter answer..."
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                Add Flashcard
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[380px]">
            {flashcards.length > 0 ? (
              <div className="w-full max-w-lg text-center space-y-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Card {currentCardIdx + 1} of {flashcards.length}
                </span>
                
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-10 min-h-[200px] flex items-center justify-center cursor-pointer shadow-2xl transition-all select-none"
                >
                  <p className="text-lg font-semibold text-white">
                    {isFlipped ? flashcards[currentCardIdx].answer : flashcards[currentCardIdx].question}
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => { setIsFlipped(false); setCurrentCardIdx((currentCardIdx - 1 + flashcards.length) % flashcards.length); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
                  >
                    {isFlipped ? 'Show Question' : 'Flip Answer'}
                  </button>
                  <button
                    onClick={() => { setIsFlipped(false); setCurrentCardIdx((currentCardIdx + 1) % flashcards.length); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No flashcards created yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Quizzes */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-indigo-400 uppercase">Question {quizIndex + 1} of {quizQuestions.length}</span>
                <span className="text-xs text-slate-500">Score: {score}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{quizQuestions[quizIndex].question}</h3>
              <div className="space-y-3">
                {quizQuestions[quizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all ${
                      selectedOption === idx
                        ? idx === quizQuestions[quizIndex].correct
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedOption !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
              <p className="text-slate-400 text-sm">You scored {score} out of {quizQuestions.length} correctly.</p>
              <button
                onClick={() => { setQuizIndex(0); setScore(0); setQuizFinished(false); setSelectedOption(null); }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Assignments */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-lg text-white">Add Assignment</h3>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Assignment title..."
                  value={newAssignTitle}
                  onChange={(e) => setNewAssignTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newAssignDate}
                  onChange={(e) => setNewAssignDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                <select
                  value={newAssignPriority}
                  onChange={(e) => setNewAssignPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                Add Assignment
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-white">Assignment Tracker ({assignments.length})</h3>
            <div className="space-y-3">
              {assignments.map(a => (
                <div
                  key={a.id}
                  className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                    a.completed ? 'bg-slate-950/40 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800 shadow-xl'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={a.completed}
                      onChange={() => setAssignments(assignments.map(item => item.id === a.id ? { ...item, completed: !item.completed } : item))}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <h4 className={`font-semibold text-sm ${a.completed ? 'line-through text-slate-500' : 'text-white'}`}>{a.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Due: {a.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-semibold ${
                      a.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {a.priority}
                    </span>
                    <button
                      onClick={() => setAssignments(assignments.filter(item => item.id !== a.id))}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};
