import React from 'react';
import Sidebar from './Sidebar';

import { supabase } from '../lib/supabase';

const DashboardLayout = ({ children, currentView, onNavigate }) => {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA]">
            <Sidebar
                currentView={currentView}
                onNavigate={onNavigate}
                onSignOut={handleSignOut}
            />


            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden bg-[#F5F5F7]">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
