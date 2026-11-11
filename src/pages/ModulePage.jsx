import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ModulePage = ({
  title,
  description,
  icon: Icon,
  status = 'Workspace ready',
  features = [],
  accent = 'indigo'
}) => {
  const accentStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
  };

  const style = accentStyles[accent] || accentStyles.indigo;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${style}`}>
            {Icon && <Icon size={28} />}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${style}`}>
                {status}
              </span>
              <span className="text-xs text-slate-500">UniSpace Workspace</span>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-slate-400 mt-3 max-w-2xl leading-6">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Workspace Features</h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore what's available in this module.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                  <CheckCircle2 size={20} />
                </div>
                <ArrowUpRight size={17} className="text-slate-600" />
              </div>

              <h3 className="text-sm font-semibold text-slate-200 mt-5">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-5">
                {feature.description}
              </p>
              <span className="inline-block mt-4 text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                {feature.status || 'Planned feature'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="text-xs text-slate-500 leading-5">
          UniSpace is currently running as a frontend-only application. Features
          that require an external AI provider or backend service will need
          additional integration before they can operate fully.
        </p>
      </section>
    </div>
  );
};
