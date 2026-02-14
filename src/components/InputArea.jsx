import React, { useRef, useEffect } from 'react';
import { Plus, Mic, ArrowUp } from 'lucide-react';

const InputArea = ({ input, setInput, handleSend, loading }) => {
    const textareaRef = useRef(null);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            handleSend();
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onHandleSubmit(e);
        }
    };

    return (
        <div className="w-full relative animate-in fade-in slide-in-from-bottom-6 duration-700">
            <form
                onSubmit={onHandleSubmit}
                className="relative flex items-end gap-2 p-3 bg-white dark:bg-gpt-input-dark rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.15)] focus-within:ring-1 ring-slate-400/40 transition-all duration-300 mb-1"
            >
                <button
                    type="button"
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors active:scale-90"
                >
                    <Plus size={22} />
                </button>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask anything"
                    disabled={loading}
                    className="flex-1 bg-transparent border-none outline-none py-2.5 px-1 max-h-[180px] overflow-y-auto text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[16px] leading-[1.6] resize-none scrollbar-none antialiased font-medium"
                />

                <div className="flex items-center gap-1.5 pb-0.5 pr-0.5">
                    <button type="button" className="hidden sm:flex p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors active:scale-90">
                        <Mic size={22} />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`p-2 rounded-full transition-all duration-300 shadow-md ${input.trim() && !loading
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black scale-100 hover:scale-105 active:scale-95'
                            : 'bg-slate-100 dark:bg-[#3d3d3d] text-slate-300 dark:text-slate-600 scale-95 opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <ArrowUp size={22} strokeWidth={3} />
                    </button>
                </div>
            </form>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2.5 tracking-tight font-bold opacity-80 select-none uppercase">
                SP AI can make mistakes. Check important info.
            </p>
        </div>
    );
};

export default InputArea;
