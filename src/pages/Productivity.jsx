import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Plus, Trash2, Play, Pause, RotateCcw, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Toast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { getUserItem, setUserItem } from '../lib/userStorage';

export const Productivity = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'pomodoro' | 'kanban'
  const [toast, setToast] = useState(null);

  // 1. Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = getUserItem(userId, 'tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
    return [
      { id: 1, title: 'Complete Frontend Roadmap milestone', priority: 'High', status: 'todo', dueDate: '2026-06-10' },
      { id: 2, title: 'Review API Tester utilities', priority: 'Medium', status: 'in-progress', dueDate: '2026-06-12' },
      { id: 3, title: 'Configure local storage persistence', priority: 'High', status: 'done', dueDate: '2026-06-05' }
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  // 2. Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'

  useEffect(() => {
    try {
      setUserItem(userId, 'tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setToast({ type: 'info', message: 'Pomodoro timer session completed!' });
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSwitchMode = (mode) => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      priority: newTaskPriority,
      status: newTaskStatus,
      dueDate: '2026-06-20'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setToast({ type: 'success', message: 'Task added successfully.' });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    setToast({ type: 'success', message: 'Task deleted.' });
  };

  const handleMoveTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <CheckSquare className="text-indigo-400" size={26} />
            <span>Productivity Hub</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage tasks, organize Kanban workflows, and maintain focus with the Pomodoro timer.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {[
            { id: 'tasks', label: 'Tasks List', icon: CheckSquare },
            { id: 'kanban', label: 'Kanban Board', icon: Calendar },
            { id: 'pomodoro', label: 'Pomodoro Timer', icon: Clock },
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

      {/* Tab 1: Tasks List */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-lg text-white">Create New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                Add Task
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-white">Task Management ({tasks.length})</h3>
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    task.status === 'done' ? 'bg-slate-950/40 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800 shadow-xl'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleMoveTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {task.status === 'done' ? <CheckCircle2 size={20} className="text-emerald-400" /> : <Circle size={20} />}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-semibold ${
                      task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
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

      {/* Tab 2: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'todo', title: 'To Do', color: 'border-slate-800 bg-slate-900' },
            { id: 'in-progress', title: 'In Progress', color: 'border-indigo-500/30 bg-slate-900' },
            { id: 'done', title: 'Done', color: 'border-emerald-500/30 bg-slate-900' },
          ].map(col => (
            <div key={col.id} className={`border rounded-3xl p-5 shadow-xl flex flex-col space-y-4 ${col.color}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-semibold text-sm text-white">{col.title}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 font-mono">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
                    <h4 className="font-semibold text-xs text-white">{task.title}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500">{task.dueDate}</span>
                      <div className="flex items-center space-x-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleMoveTaskStatus(task.id, col.id === 'done' ? 'in-progress' : 'todo')}
                            className="text-[10px] text-indigo-400 hover:underline px-1.5 py-0.5 bg-slate-900 rounded"
                          >
                            ← Prev
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMoveTaskStatus(task.id, col.id === 'todo' ? 'in-progress' : 'done')}
                            className="text-[10px] text-indigo-400 hover:underline px-1.5 py-0.5 bg-slate-900 rounded"
                          >
                            Next →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Pomodoro Timer */}
      {activeTab === 'pomodoro' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl text-center space-y-8">
          <div className="flex items-center justify-center space-x-2 bg-slate-950 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-800">
            {[
              { id: 'pomodoro', label: 'Pomodoro' },
              { id: 'shortBreak', label: 'Short Break' },
              { id: 'longBreak', label: 'Long Break' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleSwitchMode(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  timerMode === m.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="text-7xl font-extrabold font-mono text-white tracking-widest">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center space-x-2"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => { setIsRunning(false); handleSwitchMode(timerMode); }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};
