import React, { useState } from 'react';
import { LayoutDashboard, Kanban, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ currentView, onNavigate, onSignOut }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItemClass = (viewName) =>
        `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${currentView === viewName
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`;

    return (
        <aside
            className={`relative flex flex-col border-r border-gray-800 bg-[#0F1117] text-gray-400 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-gray-800 bg-[#0F1117] text-gray-400 hover:text-white shadow-sm z-10"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className="flex h-16 items-center px-6 overflow-hidden">
                {isCollapsed ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm shrink-0">
                        JQ
                    </div>
                ) : (
                    <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                        JobQuest
                    </h1>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={navItemClass('dashboard')}
                    title={isCollapsed ? "Dashboard" : ""}
                >
                    <LayoutDashboard size={18} className="shrink-0" />
                    {!isCollapsed && <span>Dashboard</span>}
                </button>
                <button
                    onClick={() => onNavigate('board')}
                    className={navItemClass('board')}
                    title={isCollapsed ? "Board" : ""}
                >
                    <Kanban size={18} className="shrink-0" />
                    {!isCollapsed && <span>Board</span>}
                </button>
                <button
                    onClick={() => onNavigate('settings')}
                    className={navItemClass('settings')}
                    title={isCollapsed ? "Settings" : ""}
                >
                    <Settings size={18} className="shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </button>
            </nav>

            {/* Footer / Sign Out */}
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={onSignOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap"
                    title={isCollapsed ? "Sign Out" : ""}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
