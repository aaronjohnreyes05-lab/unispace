import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code2, Braces, FileText, Send, Database, Regex, 
  Cpu, Copy, Check, Play, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Toast } from '../components/common/Toast';

export const DeveloperTools = () => {
  const [activeTab, setActiveTab] = useState('playground');
  const [toast, setToast] = useState(null);

  // 1. Playground State
  const [htmlCode, setHtmlCode] = useState('<div class="card">\n  <h2>Hello UniSpace</h2>\n  <p>Live sandbox execution with isolated iframe.</p>\n</div>');
  const [cssCode, setCssCode] = useState('body { background: #090d16; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n.card { background: #151c2c; padding: 24px; border-radius: 16px; border: 1px solid #334155; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }');
  const [jsCode, setJsCode] = useState('console.log("Playground script running safely in sandbox.");');
  const [iframeSrc, setIframeSrc] = useState('');

  // 2. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{\n  "workspace": "UniSpace",\n  "version": 1.0,\n  "features": ["Playground", "JSON", "API Tester"]\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccessMsg, setJsonSuccessMsg] = useState('');

  // 3. Markdown Editor State
  const [mdInput, setMdInput] = useState('# Live Markdown Preview\n\nWrite markdown on the left and see formatted output instantly using `react-markdown`.\n\n- Feature rich\n- Fast rendering\n- Clean dark mode');

  // 4. API Tester State
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiBody, setApiBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [apiHeaders, setApiHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // 5. Code Snippet Manager State
  const [snippets, setSnippets] = useState(() => {
    try {
      const saved = localStorage.getItem('unispace_dev_snippets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load snippets from localStorage', e);
    }
    return [
      { id: 1, title: 'Localstorage Hook', language: 'javascript', code: 'const [val, setVal] = useState(...)' }
    ];
  });
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetLang, setNewSnippetLang] = useState('javascript');
  const [newSnippetCode, setNewSnippetCode] = useState('');

  // 6. SQL Query Editor Demo State
  const [sqlQuery, setSqlQuery] = useState('SELECT id, name, role FROM users WHERE active = true ORDER BY name ASC LIMIT 5;');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState('');

  // 7. Regex Tester State
  const [regexPattern, setRegexPattern] = useState('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}');
  const [regexFlags, setRegexFlags] = useState({ g: true, i: true, m: false });
  const [regexTestStr, setRegexTestStr] = useState('Contact our engineering team at support@unispace.io or alex.morgan@workspace.local for assistance.');

  // 8. Base64 Encoder/Decoder State
  const [b64Input, setB64Input] = useState('UniSpace Workspace — Digital OS');
  const [b64Output, setB64Output] = useState('');
  const [b64Error, setB64Error] = useState('');

  // Persist snippets safely
  useEffect(() => {
    try {
      localStorage.setItem('unispace_dev_snippets', JSON.stringify(snippets));
    } catch (e) {
      console.error('Failed to save snippets', e);
    }
  }, [snippets]);

  // Initial playground render (without toast)
  useEffect(() => {
    const combined = `<!DOCTYPE html>
<html>
<head><style>${cssCode}</style></head>
<body>
${htmlCode}
<script>
try {
  ${jsCode}
} catch(err) {
  console.error("Runtime error:", err);
}
</script>
</body>
</html>`;
    setIframeSrc(combined);
  }, []);

  const runPlayground = () => {
    const combined = `<!DOCTYPE html>
<html>
<head><style>${cssCode}</style></head>
<body>
${htmlCode}
<script>
try {
  ${jsCode}
} catch(err) {
  console.error("Runtime error:", err);
}
</script>
</body>
</html>`;
    setIframeSrc(combined);
    setToast({ type: 'success', message: 'Playground preview updated.' });
  };

  // JSON Handlers
  const handleValidateJson = () => {
    try {
      JSON.parse(jsonInput);
      setJsonError('');
      setJsonSuccessMsg('JSON is valid.');
      setToast({ type: 'success', message: 'JSON validation successful.' });
    } catch (e) {
      setJsonError(e.message);
      setJsonSuccessMsg('');
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
      setJsonSuccessMsg('JSON formatted successfully.');
      setToast({ type: 'success', message: 'JSON formatted successfully.' });
    } catch (e) {
      setJsonError(e.message);
      setJsonOutput('');
      setJsonSuccessMsg('');
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError('');
      setJsonSuccessMsg('JSON minified successfully.');
      setToast({ type: 'success', message: 'JSON minified successfully.' });
    } catch (e) {
      setJsonError(e.message);
      setJsonOutput('');
      setJsonSuccessMsg('');
    }
  };

  // API Tester Handler with robust validation & HTTP error capture
  const handleSendApi = async () => {
    const trimmedUrl = apiUrl.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setToast({ type: 'error', message: 'Invalid URL. Must start with http:// or https://' });
      return;
    }

    if (['POST', 'PUT'].includes(apiMethod) && apiBody.trim()) {
      try {
        JSON.parse(apiBody);
      } catch (e) {
        setToast({ type: 'error', message: 'Invalid JSON format in Request Body.' });
        return;
      }
    }

    let parsedHeaders = {};
    if (apiHeaders.trim()) {
      try {
        parsedHeaders = JSON.parse(apiHeaders);
      } catch (e) {
        setToast({ type: 'error', message: 'Invalid JSON format in Headers editor.' });
        return;
      }
    }

    setApiLoading(true);
    setApiResponse(null);

    try {
      const options = {
        method: apiMethod,
        headers: parsedHeaders
      };

      if (['POST', 'PUT'].includes(apiMethod) && apiBody.trim()) {
        options.body = apiBody;
      }

      const startTime = performance.now();
      const res = await fetch(trimmedUrl, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const contentType = res.headers.get('content-type');
      let data;
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }
      } catch (err) {
        data = await res.text();
      }

      const formattedBody = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        time: duration,
        headers: Object.fromEntries(res.headers.entries()),
        body: formattedBody
      });

      if (res.ok) {
        setToast({ type: 'success', message: `Request completed with status ${res.status}` });
      } else {
        setToast({ type: 'error', message: `Server returned HTTP error status ${res.status}` });
      }
    } catch (e) {
      setApiResponse({
        status: 'Network Error',
        statusText: e.message,
        time: 0,
        headers: {},
        body: `Network or CORS Error: ${e.message}\n\nNote: Browser CORS policy may block requests to third-party endpoints without permissive CORS headers.`
      });
      setToast({ type: 'error', message: 'Network request failed.' });
    } finally {
      setApiLoading(false);
    }
  };

  // Snippet Handlers
  const handleAddSnippet = (e) => {
    e.preventDefault();
    if (!newSnippetTitle.trim() || !newSnippetCode.trim()) return;
    const newSnippet = {
      id: Date.now(),
      title: newSnippetTitle,
      language: newSnippetLang,
      code: newSnippetCode
    };
    setSnippets([newSnippet, ...snippets]);
    setNewSnippetTitle('');
    setNewSnippetCode('');
    setToast({ type: 'success', message: 'Snippet saved successfully.' });
  };

  const handleDeleteSnippet = (id) => {
    setSnippets(snippets.filter(s => s.id !== id));
    setToast({ type: 'success', message: 'Snippet deleted.' });
  };

  const handleCopySnippet = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setToast({ type: 'success', message: 'Snippet copied to clipboard.' });
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to copy to clipboard.' });
    }
  };

  // SQL Demo Handler with robust parsing against mock table
  const handleExecuteSql = () => {
    setSqlError('');
    const mockUsers = [
      { id: 1, name: 'Alex Morgan', role: 'Full Stack Developer', active: true, created_at: '2026-01-10' },
      { id: 2, name: 'Sarah Connor', role: 'DevOps Engineer', active: true, created_at: '2026-02-14' },
      { id: 3, name: 'John Doe', role: 'Student', active: false, created_at: '2026-03-01' },
      { id: 4, name: 'Emily Watson', role: 'Data Scientist', active: true, created_at: '2026-03-12' },
      { id: 5, name: 'Michael Chen', role: 'Student', active: true, created_at: '2026-03-18' }
    ];

    const query = sqlQuery.trim();
    const lowerQuery = query.toLowerCase();

    if (!lowerQuery.startsWith('select')) {
      setSqlError('Unsupported SQL syntax. Query must start with SELECT.');
      setSqlResult(null);
      return;
    }

    try {
      // 1. Parse columns between SELECT and FROM
      const fromIdx = lowerQuery.indexOf('from');
      if (fromIdx === -1 || !lowerQuery.slice(fromIdx).includes('users')) {
        throw new Error('Invalid table name. Only the "users" table is supported in this local demo.');
      }

      const selectPart = query.slice(6, fromIdx).trim();
      let columns = selectPart === '*' ? ['id', 'name', 'role', 'active', 'created_at'] : selectPart.split(',').map(c => c.trim().toLowerCase());
      
      const validCols = ['id', 'name', 'role', 'active', 'created_at'];
      for (let col of columns) {
        if (!validCols.includes(col)) {
          throw new Error(`Unknown column "${col}". Available columns: id, name, role, active, created_at`);
        }
      }

      let results = [...mockUsers];

      // 2. Parse WHERE clause
      const whereIdx = lowerQuery.indexOf('where');
      if (whereIdx !== -1) {
        const restAfterWhere = query.slice(whereIdx + 5).trim();
        // Check for active condition
        if (restAfterWhere.toLowerCase().startsWith('active =')) {
          const valStr = restAfterWhere.slice(8).trim().toLowerCase();
          const targetActive = valStr.startsWith('true');
          results = results.filter(u => u.active === targetActive);
        } else if (restAfterWhere.toLowerCase().startsWith('role =')) {
          const matchRole = restAfterWhere.slice(6).trim().replace(/^['"]|['"]$/g, '');
          results = results.filter(u => u.role.toLowerCase() === matchRole.toLowerCase());
        } else {
          throw new Error('Unsupported WHERE clause. Supported filters: WHERE active = true/false or WHERE role = "Student"');
        }
      }

      // 3. Parse ORDER BY clause
      const orderIdx = lowerQuery.indexOf('order by');
      if (orderIdx !== -1) {
        const orderPart = query.slice(orderIdx + 8).trim();
        const parts = orderPart.split(/\s+/);
        const sortCol = parts[0]?.toLowerCase();
        const direction = parts[1]?.toLowerCase() === 'desc' ? 'desc' : 'asc';

        if (!validCols.includes(sortCol)) {
          throw new Error(`Invalid ORDER BY column "${sortCol}".`);
        }

        results.sort((a, b) => {
          let valA = a[sortCol];
          let valB = b[sortCol];
          if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }
          if (valA < valB) return direction === 'asc' ? -1 : 1;
          if (valA > valB) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // 4. Parse LIMIT clause
      const limitIdx = lowerQuery.indexOf('limit');
      if (limitIdx !== -1) {
        const limitPart = query.slice(limitIdx + 5).trim();
        const limitNum = parseInt(limitPart, 10);
        if (isNaN(limitNum) || limitNum < 0) {
          throw new Error('Invalid LIMIT clause parameter.');
        }
        results = results.slice(0, limitNum);
      }

      // Project selected columns
      const projected = results.map(row => {
        const obj = {};
        columns.forEach(col => {
          obj[col] = row[col];
        });
        return obj;
      });

      setSqlResult({ columns, rows: projected });
      setToast({ type: 'success', message: 'SQL query executed successfully.' });
    } catch (err) {
      setSqlError(err.message);
      setSqlResult(null);
    }
  };

  // Base64 Handlers
  const handleEncodeB64 = () => {
    try {
      const encoded = btoa(encodeURIComponent(b64Input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
      setB64Output(encoded);
      setB64Error('');
      setToast({ type: 'success', message: 'Encoded to Base64 successfully.' });
    } catch (e) {
      setB64Error(e.message);
      setB64Output('');
    }
  };

  const handleDecodeB64 = () => {
    try {
      const decoded = decodeURIComponent(atob(b64Input).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      setB64Output(decoded);
      setB64Error('');
      setToast({ type: 'success', message: 'Decoded from Base64 successfully.' });
    } catch (e) {
      setB64Error('Invalid Base64 encoded string.');
      setB64Output('');
    }
  };

  // Regex Match Calculation
  const getRegexMatches = () => {
    try {
      let flagStr = '';
      if (regexFlags.g) flagStr += 'g';
      if (regexFlags.i) flagStr += 'i';
      if (regexFlags.m) flagStr += 'm';

      const regex = new RegExp(regexPattern, flagStr);
      const matches = [];
      let match;
      if (regexFlags.g) {
        while ((match = regex.exec(regexTestStr)) !== null) {
          matches.push({ text: match[0], index: match.index });
          if (match.index === regex.lastIndex) regex.lastIndex++; 
        }
      } else {
        match = regexTestStr.match(regex);
        if (match) {
          matches.push({ text: match[0], index: match.index });
        }
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: e.message };
    }
  };

  const regexResult = getRegexMatches();

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in">
      {/* Header & Tool Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Terminal className="text-emerald-400" size={26} />
            <span>Developer Tools</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Professional sandbox utilities, formatters, and testing suites for engineers.</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto shadow-xl">
          {[
            { id: 'playground', label: 'Playground', icon: Code2 },
            { id: 'json', label: 'JSON', icon: Braces },
            { id: 'markdown', label: 'Markdown', icon: FileText },
            { id: 'api', label: 'API Tester', icon: Send },
            { id: 'snippets', label: 'Snippets', icon: Cpu },
            { id: 'sql', label: 'SQL Demo', icon: Database },
            { id: 'regex', label: 'Regex', icon: Regex },
            { id: 'base64', label: 'Base64', icon: Terminal },
          ].map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tool.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. HTML/CSS/JS Playground */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
          <div className="flex flex-col space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
                <Code2 size={16} className="text-emerald-400" />
                <span>Sandbox Editors</span>
              </h3>
              <button
                onClick={runPlayground}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5"
              >
                <Play size={14} />
                <span>Run Code</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">HTML</label>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-emerald-500 h-28 resize-none shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">CSS</label>
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 h-28 resize-none shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">JavaScript</label>
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-emerald-500 h-28 resize-none shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <h3 className="font-semibold text-sm text-white mb-3 flex items-center space-x-2">
              <Terminal size={16} className="text-cyan-400" />
              <span>Isolated Sandbox Output (iframe)</span>
            </h3>
            <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <iframe
                srcDoc={iframeSrc}
                title="sandbox-preview"
                sandbox="allow-scripts"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. JSON Formatter & Validator */}
      {activeTab === 'json' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
                <Braces size={16} className="text-emerald-400" />
                <span>JSON Input</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleValidateJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Validate
                </button>
                <button
                  onClick={handleMinifyJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Minify
                </button>
                <button
                  onClick={handleFormatJson}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-md shadow-emerald-600/20"
                >
                  Format
                </button>
              </div>
            </div>
            <textarea
              rows={12}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
            />
            {jsonError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-300 text-xs font-mono">
                <AlertCircle size={16} className="shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
            {jsonSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs font-mono">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{jsonSuccessMsg}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white">Formatted & Validated Output</h3>
            <pre className="w-full h-72 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 overflow-auto shadow-inner">
              {jsonOutput || 'Click "Format" or "Validate" to inspect your JSON payload...'}
            </pre>
          </div>
        </div>
      )}

      {/* 3. Markdown Editor */}
      {activeTab === 'markdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <h3 className="font-semibold text-sm text-white mb-3 flex items-center space-x-2">
              <FileText size={16} className="text-emerald-400" />
              <span>Markdown Source</span>
            </h3>
            <textarea
              value={mdInput}
              onChange={(e) => setMdInput(e.target.value)}
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <h3 className="font-semibold text-sm text-white mb-3">Live Formatted Preview</h3>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-y-auto prose prose-invert max-w-none text-xs sm:text-sm shadow-inner">
              <ReactMarkdown>{mdInput}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* 4. API Tester */}
      {activeTab === 'api' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-semibold text-lg text-white flex items-center space-x-2">
            <Send size={18} className="text-emerald-400" />
            <span>Browser Fetch API Tester</span>
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={apiMethod}
              onChange={(e) => setApiMethod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <button
              onClick={handleSendApi}
              disabled={apiLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
            >
              {apiLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{apiLoading ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['POST', 'PUT'].includes(apiMethod) && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Request Body (JSON)</label>
                <textarea
                  rows={4}
                  value={apiBody}
                  onChange={(e) => setApiBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
                />
              </div>
            )}
            <div className={['POST', 'PUT'].includes(apiMethod) ? '' : 'md:col-span-2'}>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Headers (JSON)</label>
              <textarea
                rows={['POST', 'PUT'].includes(apiMethod) ? 4 : 2}
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Payload</span>
              {apiResponse && (
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className={`px-2.5 py-1 rounded-md font-bold ${typeof apiResponse.status === 'number' && apiResponse.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    Status: {apiResponse.status} {apiResponse.statusText}
                  </span>
                  <span className="text-slate-400">Time: {apiResponse.time} ms</span>
                </div>
              )}
            </div>
            <pre className="w-full h-72 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 overflow-auto shadow-inner">
              {apiLoading ? 'Executing fetch request...' : (apiResponse ? apiResponse.body : 'Response payload will appear here after sending request...')}
            </pre>
          </div>
        </div>
      )}

      {/* 5. Code Snippet Manager */}
      {activeTab === 'snippets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-lg text-white flex items-center space-x-2">
              <Cpu size={18} className="text-emerald-400" />
              <span>Save Code Snippet</span>
            </h3>
            <form onSubmit={handleAddSnippet} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Snippet Title</label>
                <input
                  type="text"
                  placeholder="e.g., Debounce Hook"
                  value={newSnippetTitle}
                  onChange={(e) => setNewSnippetTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Language</label>
                <select
                  value={newSnippetLang}
                  onChange={(e) => setNewSnippetLang(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Code</label>
                <textarea
                  rows={6}
                  placeholder="Paste or write code snippet..."
                  value={newSnippetCode}
                  onChange={(e) => setNewSnippetCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none resize-none shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20"
              >
                Save Snippet
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-white">Saved Snippets ({snippets.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {snippets.map(s => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {s.language}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopySnippet(s.code)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Copy snippet"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-850 transition-colors"
                          title="Delete snippet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-white">{s.title}</h4>
                    <pre className="bg-slate-950 p-3 rounded-2xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-36 shadow-inner">
                      {s.code}
                    </pre>
                  </div>
                </div>
              ))}
              {snippets.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500 text-sm">No code snippets saved yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SQL Query Editor Demo */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-white flex items-center space-x-2">
                <Database size={18} className="text-emerald-400" />
                <span>SQL Query Editor Demonstration (Local Mock DB)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Supports SELECT columns, WHERE active = true/false or role = 'Student', ORDER BY [col] ASC/DESC, and LIMIT.</p>
            </div>
            <button
              onClick={handleExecuteSql}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
            >
              <Play size={16} />
              <span>Execute Query</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
          />

          {sqlError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs font-mono">
              {sqlError}
            </div>
          )}

          {sqlResult && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Query Results ({sqlResult.rows.length} rows)</span>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      {sqlResult.columns.map((col) => (
                        <th key={col} className="p-3 uppercase">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {sqlResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        {sqlResult.columns.map((col) => (
                          <td key={col} className="p-3">
                            {typeof row[col] === 'boolean' ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${row[col] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                {row[col] ? 'true' : 'false'}
                              </span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Regex Tester */}
      {activeTab === 'regex' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Regex size={16} className="text-emerald-400" />
              <span>Regular Expression Pattern</span>
            </h3>
            
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 focus-within:border-emerald-500 shadow-inner">
              <span className="text-slate-500 font-mono">/</span>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <span className="text-slate-500 font-mono">/</span>
              <span className="text-xs font-mono text-amber-400">
                {regexFlags.g ? 'g' : ''}{regexFlags.i ? 'i' : ''}{regexFlags.m ? 'm' : ''}
              </span>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regexFlags.g}
                  onChange={(e) => setRegexFlags({ ...regexFlags, g: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <span>Global (g)</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regexFlags.i}
                  onChange={(e) => setRegexFlags({ ...regexFlags, i: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <span>Case Insensitive (i)</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regexFlags.m}
                  onChange={(e) => setRegexFlags({ ...regexFlags, m: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <span>Multiline (m)</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Test String</label>
              <textarea
                rows={6}
                value={regexTestStr}
                onChange={(e) => setRegexTestStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white">Match Results</h3>
            {regexResult.error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs font-mono">
                Regex Error: {regexResult.error}
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Found {regexResult.matches.length} match(es)
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {regexResult.matches.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold">{m.text}</span>
                      <span className="text-slate-500">Index: {m.index}</span>
                    </div>
                  ))}
                  {regexResult.matches.length === 0 && (
                    <div className="py-12 text-center text-slate-500 text-xs">No matches found in test string.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Base64 Encoder/Decoder */}
      {activeTab === 'base64' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Terminal size={16} className="text-emerald-400" />
              <span>Input Text or Base64</span>
            </h3>
            <textarea
              rows={8}
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEncodeB64}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                Encode to Base64
              </button>
              <button
                onClick={handleDecodeB64}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                Decode from Base64
              </button>
            </div>
            {b64Error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-mono">
                {b64Error}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white">Output Result</h3>
              {b64Output && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(b64Output);
                      setToast({ type: 'success', message: 'Output copied to clipboard.' });
                    } catch (e) {
                      setToast({ type: 'error', message: 'Failed to copy to clipboard.' });
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
              )}
            </div>
            <pre className="w-full h-56 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 overflow-auto shadow-inner">
              {b64Output || 'Output will appear here after encoding or decoding...'}
            </pre>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};