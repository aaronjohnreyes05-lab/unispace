
export const getSimulatedAIResponse = (prompt, persona = 'general') => {
  const lower = prompt.toLowerCase();

  if (lower.includes('react') || lower.includes('component')) {
    return `### React Architecture Best Practices

When building scalable React applications without a backend, structuring your components cleanly is essential:

1. **Lift State Up wisely**: Keep state as close to where it's needed as possible.
2. **Custom Hooks**: Extract complex logic into reusable hooks like \`useLocalStorage\` or \`useFetch\`.
3. **Component Modularity**: Avoid monolithic files. Break down components into \`components/layout\`, \`components/common\`, and module-specific folders.

\`\`\`javascript
// Example Custom Hook for LocalStorage
import { useState, useEffect } from 'react';

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
\`\`\``;
  }

  if (lower.includes('sql') || lower.includes('database')) {
    return `### SQL Query Optimization

To optimize queries in relational databases:

- **Indexing**: Always index columns used frequently in \`WHERE\` clauses or \`JOIN\` conditions.
- **Avoid SELECT \***: Specify exact column names to reduce I/O overhead.
- **Use EXPLAIN**: Analyze query execution plans before deploying to production.`;
  }

  if (lower.includes('study') || lower.includes('exam')) {
    return `### Effective Study Plan & Pomodoro Technique

1. **Active Recall**: Test yourself rather than passively re-reading notes.
2. **Spaced Repetition**: Review flashcards at increasing intervals.
3. **Pomodoro Sprints**: Study with intense focus for 25 minutes, followed by a 5-minute break.`;
  }

  return `I've analyzed your prompt regarding **"${prompt}"**. Since UniSpace is running in frontend-only demo mode, I am providing simulated intelligent responses. You can connect a real LLM API provider in your production configuration settings.

Key takeaways:
- Ensure your inputs are validated.
- Persist important state in browser storage.
- Keep your UI responsive and modular.`;
};
