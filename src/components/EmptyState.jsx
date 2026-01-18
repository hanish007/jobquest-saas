import React from 'react';
import { Rocket } from 'lucide-react';

const EmptyState = ({ onAddJob }) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Rocket size={48} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Ready to land your dream job?</h2>
            <p className="mb-8 max-w-sm text-gray-500">
                Track your first application now. Visualize your progress and organize your search in one place.
            </p>
            <button
                onClick={onAddJob}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
                Add Job
            </button>
        </div>
    );
};

export default EmptyState;
