import React from 'react';
import { Plus, MessageSquare, Search, Settings, User, Trash2, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ history, onNewChat, onSelectChat, currentSession, isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <div className="flex flex-col w-[260px] bg-white dark:bg-gpt-sidebar h-full text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden overflow-y-auto scrollbar-thin transition-colors duration-300">
            <div className="p-3 flex flex-col h-full bg-inherit">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onNewChat}
                        className="flex-1 flex items-center gap-3 px-3 py-3 rounded-lg border border-slate-200 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 group active:scale-[0.98]"
                    >
                        <Plus size={16} className="text-slate-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">New Chat</span>
                    </button>
                    {isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="ml-2 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors hidden md:block"
                            title="Close Sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    )}
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto space-y-1 mb-4 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3 select-none">Recent Chats</div>

                    <div className="space-y-1 px-1">
                        {history.length > 0 ? (
                            history.map((chat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelectChat(chat.sessionId)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-200 group relative ${currentSession === chat.sessionId
                                        ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                                        }`}
                                >
                                    <MessageSquare size={14} className={`flex-shrink-0 ${currentSession === chat.sessionId ? 'text-primary-400' : 'opacity-60 group-hover:opacity-100'}`} />
                                    <span className="truncate flex-1 font-medium">{chat.text || 'Previous Chat'}</span>

                                    {currentSession === chat.sessionId && (
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:text-red-400 transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-10 text-xs text-slate-400 dark:text-slate-500 italic text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                                Start a conversation
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Menu */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group">
                        <Search size={16} className="opacity-60 group-hover:opacity-100" />
                        <span className="font-medium">Search history</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group">
                        <Settings size={16} className="opacity-60 group-hover:opacity-100" />
                        <span className="font-medium">Settings</span>
                    </button>

                    <div className="mt-4 p-3 flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer group mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                            SP
                        </div>
                        <div className="flex-1 min-w-0 font-medium">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-200 transition-colors">Shreyash Patil</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Free Plan ✨</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
