
import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import {
  CheckCircle2,
  Circle
} from 'lucide-react';

export const RoadmapDetailModal = ({
  isOpen,
  onClose,
  roadmap,
  onUpdateProgress
}) => {
  const [completedNodes, setCompletedNodes] = useState([]);

  useEffect(() => {
    if (roadmap) {
      setCompletedNodes(roadmap.completedList || []);
    }
  }, [roadmap]);

  if (!roadmap) return null;

  const nodes = roadmap.nodes || [];

  const progress = nodes.length > 0
    ? Math.round((completedNodes.length / nodes.length) * 100)
    : 0;

  const toggleNode = (nodeId) => {
    const updated = completedNodes.includes(nodeId)
      ? completedNodes.filter(id => id !== nodeId)
      : [...completedNodes, nodeId];

    setCompletedNodes(updated);

    const newProgress = nodes.length > 0
      ? Math.round((updated.length / nodes.length) * 100)
      : 0;

    onUpdateProgress(roadmap.id, newProgress, updated);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={roadmap.title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">

        {/* Roadmap Information */}
        <div>
          <p className="text-sm text-slate-400">
            {roadmap.description}
          </p>

          <div className="mt-4 flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">
                Overall Mastery Progress
              </span>

              <h4 className="text-lg font-bold text-white mt-0.5">
                {progress}% Completed
              </h4>
            </div>

            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Curriculum Nodes
          </h4>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {nodes.map(node => {
              const isCompleted = completedNodes.includes(node.id);

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {isCompleted
                      ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      : <Circle size={20} className="text-slate-500 shrink-0" />
                    }

                    <div className="min-w-0">
                      <h5 className="font-semibold text-sm">
                        {node.label}
                      </h5>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </button>
              );
            })}

            {nodes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">
                No curriculum nodes available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
