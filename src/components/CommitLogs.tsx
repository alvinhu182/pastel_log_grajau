import React, { useState } from 'react';
import { GitCommit, Star, Heart, Terminal, Play, Send, Check } from 'lucide-react';
import { CommitLog } from '../types';

interface CommitLogsProps {
  logs: CommitLog[];
  onAddCommit: (author: string, message: string) => void;
}

export default function CommitLogs({ logs, onAddCommit }: CommitLogsProps) {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitCommit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedAuthor = author.trim().replace(/\s+/g, '_').toLowerCase();
    const trimmedMessage = message.trim();

    if (!trimmedAuthor) {
      setErrorMessage("Error: Author handle is required (cannot commit anonymously).");
      return;
    }
    if (!trimmedMessage) {
      setErrorMessage("Error: Commit message (custom review) is empty.");
      return;
    }

    onAddCommit(trimmedAuthor, trimmedMessage);
    
    // Animate success
    setIsCommitted(true);
    setErrorMessage('');
    setMessage('');
    
    setTimeout(() => {
      setIsCommitted(false);
    }, 3000);
  };

  return (
    <div id="git-commits-section" className="space-y-6 font-mono">
      
      {/* Title */}
      <div className="space-y-1 text-center max-w-2xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center space-x-2">
          <GitCommit className="w-5.5 h-5.5 text-[#FFC107] rotate-90" />
          <span>Git_Log_History.sh</span>
        </h3>
        <p className="text-zinc-500 text-xs font-mono">
          Logs de commits coletados de clientes reais. Registre suas sugestões e melhorias no nosso repositório.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Write Commit Form Column */}
        <div className="lg:col-span-5 bg-[#151518]/90 rounded border border-white/10 p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10 mb-2 text-white">
            <Terminal className="w-4 h-4 text-[#00FF66]" />
            <span className="text-xs font-bold uppercase tracking-wider">Git Commit Executor</span>
          </div>

          <form onSubmit={handleSubmitCommit} className="space-y-4 text-xs">
            
            {/* Author */}
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 block font-bold uppercase">--author=</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-650">@</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="seu_user_github"
                  className="w-full bg-[#121214] border border-white/10 rounded py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-[#FFC107] font-mono text-xs"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 block font-bold uppercase">-m &quot;commit_message&quot;</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex prime: o recheio do Merge Conflict é fantástico, melhor suculência."
                rows={3}
                className="w-full bg-[#121214] border border-white/10 rounded py-2.5 px-3 text-white focus:outline-none focus:border-[#FFC107] font-mono text-xs resize-none"
              />
            </div>

            {errorMessage && (
              <span className="text-rose-450 text-[10px] block font-mono">{errorMessage}</span>
            )}

            {isCommitted ? (
              <div className="py-2.5 bg-[#00FF66]/10 border border-[#00FF66]/20 rounded text-[#00FF66] flex items-center justify-center space-x-1.5 font-bold">
                <Check className="w-4 h-4 animate-bounce" />
                <span>[SUCCESS] Commit Registrado!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#121214] font-bold py-2.5 px-4 rounded flex items-center justify-center space-x-1.5 cursor-pointer transition font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>GIT COMMIT -M &quot;REVISÃO&quot;</span>
              </button>
            )}

          </form>
        </div>

        {/* Feed Timeline Column */}
        <div className="lg:col-span-7 space-y-3.5 max-h-[380px] overflow-y-auto scrollbar-thin rounded p-1 bg-black/10">
          {logs.map((log) => {
            return (
              <div
                key={log.id}
                className="bg-[#151518]/90 rounded border border-white/10 p-4 relative group hover:border-white/20 transition"
              >
                {/* Timeline line connector */}
                <span className="absolute top-4 left-0 w-[3px] h-10 bg-[#FFC107] opacity-60 rounded-r" />

                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 pl-2">
                    
                    {/* Commit hash and author */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono leading-none">
                      <span className="text-[#FFC107] font-bold bg-[#FFC107]/5 border border-white/5 px-1 rounded">
                        commit_{log.hash}
                      </span>
                      <span className="text-zinc-650">|</span>
                      <span className="text-zinc-300 font-semibold text-xs">
                        {log.author}
                      </span>
                      <span className="text-zinc-600 text-[9px] font-normal">
                        ({log.timestamp})
                      </span>
                    </div>

                    {/* Commit message */}
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-normal pt-1 break-words">
                      {log.message}
                    </p>

                  </div>

                  {/* Likes counter simulated as git approvals */}
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider mb-1">Approved_By</span>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono bg-[#121214] px-2 py-0.5 rounded border border-white/10 text-rose-400 font-medium">
                      <Heart className="w-3 h-3 text-rose-500 fill-current" />
                      <span>{log.likes}</span>
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
