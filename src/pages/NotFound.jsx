import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
        <Compass size={30} className="text-indigo-400" />
      </div>

      <p className="text-sm font-semibold text-indigo-400 tracking-widest uppercase">Error 404</p>
      <h1 className="text-5xl font-bold text-white mt-3">Page not found</h1>
      <p className="text-sm text-slate-400 mt-4 leading-6">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
      >
        <Home size={16} />
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>
    </div>
  </div>
);
