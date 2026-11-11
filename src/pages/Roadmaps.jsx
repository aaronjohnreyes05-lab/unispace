import React, { useState, useEffect } from 'react';
import { Map, Search, Sparkles, CheckCircle2, Clock, BookOpen, ArrowRight, Plus } from 'lucide-react';
import { initialRoadmaps } from '../data/roadmapsData';
import { RoadmapDetailModal } from '../modules/roadmaps/RoadmapDetailModal';
import { Toast } from '../components/common/Toast';

export const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState(() => {
    const saved = localStorage.getItem('unispace_roadmaps');
    if (saved) return JSON.parse(saved);
    
    // Detailed node lists for roadmaps
    return initialRoadmaps.map(r => ({
      ...r,
      completedList: Array.from({ length: r.completedNodes }, (_, i) => `node-${i + 1}`),
      nodes: Array.from({ length: r.nodesCount }, (_, i) => ({
        id: `node-${i + 1}`,
        label: `Core Topic Module ${i + 1}`,
        description: `Master fundamental and advanced concepts for milestone ${i + 1}.`
      }))
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('unispace_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  const handleUpdateProgress = (roadmapId, newProgress, completedList) => {
    setRoadmaps(prev => prev.map(r => {
      if (r.id === roadmapId) {
        return {
          ...r,
          progress: newProgress,
          completedNodes: completedList.length,
          completedList
        };
      }
      return r;
    }));
    setToast({ type: 'success', message: 'Roadmap progress updated successfully.' });
  };

  const filteredRoadmaps = roadmaps.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <span>Roadmap Studio</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Interactive skill paths inspired by roadmap.sh to guide your engineering mastery.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Roadmap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps.map((roadmap) => (
          <div 
            key={roadmap.id}
            onClick={() => setSelectedRoadmap(roadmap)}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {roadmap.category}
                </span>
                <span className="text-xs font-medium text-slate-400">{roadmap.difficulty}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{roadmap.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{roadmap.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Progress</span>
                <span className="font-semibold text-cyan-400">{roadmap.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-xs text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>View curriculum</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <RoadmapDetailModal
        isOpen={!!selectedRoadmap}
        onClose={() => setSelectedRoadmap(null)}
        roadmap={selectedRoadmap}
        onUpdateProgress={handleUpdateProgress}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};