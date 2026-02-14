import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

const ChatWindow = ({ messages, loading }) => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
        const timers = [
            setTimeout(scrollToBottom, 100),
            setTimeout(scrollToBottom, 300),
            setTimeout(scrollToBottom, 600)
        ];
        return () => timers.forEach(t => clearTimeout(t));
    }, [messages, loading]);

    return (
        <main
            ref={containerRef}
            className="flex-1 overflow-y-auto w-full flex flex-col items-center scrollbar-custom bg-gpt-main-light dark:bg-gpt-main-dark transition-colors duration-300"
        >
            <div className="w-full max-w-3xl flex flex-col min-h-full">
                {messages.length === 0 && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 animate-in fade-in zoom-in-95 duration-700">
                        <div className="w-16 h-16 bg-white dark:bg-[#2f2f2f] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center mb-8 shadow-md transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">How can I help you today?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-xl leading-relaxed font-medium">
                            Ask me anything about code, logic, or data analysis. I'm ready.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col pt-4">
                        {messages.map((msg, index) => (
                            <MessageItem key={index} message={msg} scrollToBottom={scrollToBottom} />
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="w-full py-10 flex justify-center animate-pulse">
                        <div className="w-full max-w-3xl flex gap-5 px-4 sm:px-6">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2f2f2f] border border-slate-200 dark:border-white/10" />
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-full w-1/4" />
                                <div className="space-y-3">
                                    <div className="h-3.5 bg-slate-200 dark:bg-white/5 rounded-full w-full" />
                                    <div className="h-3.5 bg-slate-200 dark:bg-white/5 rounded-full w-5/6" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} className="h-48 flex-shrink-0" />
            </div>
        </main>
    );
};

export default ChatWindow;
