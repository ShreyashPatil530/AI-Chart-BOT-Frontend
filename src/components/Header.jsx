import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
    return (
        <header className="glass-header px-4 py-3 sm:px-8 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-600 rounded-lg text-white shadow-lg shadow-primary-500/30">
                    <Sparkles size={20} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    GenAI Chat
                </h1>
            </div>

            <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:ring-2 ring-primary-500/20 transition-all duration-300"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </header>
    );
};

export default Header;
