import React, { useState, useEffect } from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageItem = ({ message, scrollToBottom }) => {
    const isAI = message.sender === 'ai';
    const [displayedText, setDisplayedText] = useState(isAI && message.animate ? '' : message.text);
    const [isTyping, setIsTyping] = useState(isAI && message.animate);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        if (isAI && message.animate && displayedText.length < message.text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(message.text.slice(0, displayedText.length + 1));
                // Scroll to bottom as text grows
                if (scrollToBottom) scrollToBottom();
            }, 5);
            return () => clearTimeout(timeout);
        } else if (isTyping) {
            setIsTyping(false);
            // Final scroll when typing finishes
            if (scrollToBottom) scrollToBottom();
        }
    }, [isAI, message.animate, message.text, displayedText, isTyping, scrollToBottom]);

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className={`w-full py-8 flex justify-center group transition-colors duration-200 border-b border-transparent ${isAI ? 'bg-gpt-ai-bg-light dark:bg-transparent' : 'bg-transparent'
            }`}>
            <div className="w-full max-w-3xl flex gap-5 px-4 sm:px-6">
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 ${isAI
                    ? 'bg-white dark:bg-gpt-sidebar border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100'
                    : 'bg-primary-600 border-primary-600 text-white ring-2 ring-primary-500/10'
                    }`}>
                    {isAI ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight opacity-70 select-none">
                        {isAI ? 'SP AI' : 'You'}
                    </p>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-[15.5px] leading-[1.7] text-slate-900 dark:text-slate-200 antialiased font-medium whitespace-pre-wrap">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeContent = String(children).replace(/\n$/, '');
                                    const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

                                    return !inline && match ? (
                                        <div className="relative my-5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm transition-shadow hover:shadow-md">
                                            <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-black/40 border-b border-slate-200 dark:border-white/10">
                                                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{match[1]}</span>
                                                <button
                                                    onClick={() => handleCopyCode(codeContent, codeId)}
                                                    className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
                                                >
                                                    {copiedCode === codeId ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                                                    {copiedCode === codeId ? 'Copied!' : 'Copy code'}
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                className="!m-0 !bg-[#1e1e1e] dark:!bg-black/60 !p-4 !text-[13.5px] !leading-relaxed"
                                                {...props}
                                            >
                                                {codeContent}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className="bg-slate-200/50 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[13.5px] text-primary-700 dark:text-primary-300 font-bold" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {displayedText}
                        </ReactMarkdown>
                        {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-slate-400 dark:bg-slate-500 animate-pulse align-middle" />}
                    </div>

                    {/* AI Actions */}
                    {isAI && (
                        <div className="flex items-center gap-1 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-500 transition-all active:scale-95">
                                <Copy size={13} />
                            </button>
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-500 transition-all active:scale-95">
                                <ThumbsUp size={13} />
                            </button>
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-500 transition-all active:scale-95">
                                <ThumbsDown size={13} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
