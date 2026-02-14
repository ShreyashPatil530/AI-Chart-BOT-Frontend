import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import { chatService } from './services/api';
import { Menu, ChevronDown, Share2, Sun, Moon, X, PanelLeft } from 'lucide-react';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [sessionId, setSessionId] = useState('');
    const [sidebarHistory, setSidebarHistory] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Load Initial State
    useEffect(() => {
        const savedSessionId = localStorage.getItem('chatSessionId') || `session_${Math.random().toString(36).substr(2, 9)}`;
        const savedTheme = localStorage.getItem('theme') || 'dark';

        if (!localStorage.getItem('chatSessionId')) {
            localStorage.setItem('chatSessionId', savedSessionId);
        }

        setSessionId(savedSessionId);
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        fetchChatHistory(savedSessionId);
        checkBackendHealth();
    }, []);

    const checkBackendHealth = async () => {
        try {
            const response = await chatService.checkHealth();
            if (response.success) {
                const healthMsg = {
                    sender: 'ai',
                    text: response.message,
                    timestamp: new Date(),
                    animate: true,
                    isSystemInfo: true // Tag to distinguish health check
                };
                setMessages(prev => [healthMsg, ...prev]);
            }
        } catch (err) {
            console.error('Health check failed', err);
        }
    };

    const fetchChatHistory = async (id) => {
        try {
            const response = await chatService.getHistory(id);
            if (response.success && response.data.length > 0) {
                setMessages(response.data);
                updateSidebarEntry(id, response.data);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.log('No chat history found');
            setMessages([]);
        }
    };

    const updateSidebarEntry = (id, msgList) => {
        const firstUserMsg = msgList.find(m => m.sender === 'user');
        if (firstUserMsg) {
            setSidebarHistory(prev => {
                const exists = prev.find(h => h.sessionId === id);
                if (exists) {
                    return prev.map(h => h.sessionId === id ? { ...h, text: firstUserMsg.text } : h);
                }
                return [{ sessionId: id, text: firstUserMsg.text }, ...prev];
            });
        }
    };

    const onNewChat = () => {
        const newId = `session_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatSessionId', newId);
        setSessionId(newId);
        setMessages([]);
        setInput('');
        setIsMobileSidebarOpen(false);
    };

    const onSelectChat = (id) => {
        setSessionId(id);
        localStorage.setItem('chatSessionId', id);
        fetchChatHistory(id);
        setIsMobileSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { sender: 'user', text: input, timestamp: new Date() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);

        const currentInput = input;
        setInput('');
        setLoading(true);

        if (messages.length === 0) {
            setSidebarHistory(prev => [{ sessionId, text: currentInput }, ...prev]);
        }

        try {
            const response = await chatService.sendMessage(sessionId, currentInput);
            if (response.success) {
                const aiMsg = { sender: 'ai', text: response.data, timestamp: new Date(), animate: true };
                setMessages([...newMessages, aiMsg]);
            }
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { sender: 'ai', text: 'Service unavailable. Please check your API key.', timestamp: new Date() }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        console.log('Switching theme to:', newTheme);
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div className="flex w-full h-screen bg-gpt-main-light dark:bg-gpt-main-dark transition-colors duration-300 overflow-hidden font-sans fixed inset-0">

            {/* Desktop Sidebar */}
            <div className={`hidden md:flex flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'}`}>
                <Sidebar
                    history={sidebarHistory}
                    onNewChat={onNewChat}
                    onSelectChat={onSelectChat}
                    currentSession={sessionId}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[100] flex">
                    <div className="flex-shrink-0 animate-in slide-in-from-left duration-300 h-full">
                        <Sidebar
                            history={sidebarHistory}
                            onNewChat={onNewChat}
                            onSelectChat={onSelectChat}
                            currentSession={sessionId}
                        />
                    </div>
                    <div
                        className="flex-1 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    >
                        <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden bg-gpt-main-light dark:bg-gpt-main-dark">
                {/* Top Header */}
                <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 z-40 bg-gpt-main-light/80 dark:bg-gpt-main-dark/80 backdrop-blur-md select-none border-b border-slate-200 dark:border-white/5 transition-colors">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="md:hidden p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="hidden md:flex p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="Open Sidebar"
                            >
                                <PanelLeft size={20} />
                            </button>
                        )}
                        <div className="group flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 cursor-pointer transition-all duration-200 active:scale-95">
                            <span className="font-bold text-[17.5px] text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                SP AI <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors mt-0.5" />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-all"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm dark:shadow-none bg-white dark:bg-transparent">
                            <Share2 size={15} />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </header>

                {/* Chat Window Container */}
                <div className="flex-1 flex flex-col items-center overflow-hidden relative">
                    <ChatWindow messages={messages} loading={loading} />
                </div>

                {/* Floating Input Container */}
                <div className="flex-shrink-0 w-full flex justify-center pb-6 px-4 pt-2 bg-gradient-to-t from-gpt-main-light dark:from-gpt-main-dark via-gpt-main-light dark:via-gpt-main-dark to-transparent pointer-events-none">
                    <div className="w-full max-w-3xl pointer-events-auto">
                        <InputArea
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
