import React from 'react';
import { LayoutDashboard, Kanban, Settings, LogOut } from 'lucide-react';

import { supabase } from '../lib/supabase';

const DashboardLayout = ({ children, currentView, onNavigate }) => {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const navItemClass = (viewName) =>
        `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${currentView === viewName
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`;

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA]">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r border-gray-800 bg-[#0F1117] text-gray-400">
                <div className="flex h-16 items-center px-6">
                    <h1 className="text-xl font-bold tracking-tight text-white">JobQuest</h1>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={navItemClass('dashboard')}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => onNavigate('board')}
                        className={navItemClass('board')}
                    >
                        <Kanban size={18} />
                        Board
                    </button>
                    <button
                        onClick={() => onNavigate('settings')}
                        className={navItemClass('settings')}
                    >
                        <Settings size={18} />
                        Settings
                    </button>
                </nav>

                <div className="border-t border-gray-800 p-4">
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden bg-[#F5F5F7]">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
