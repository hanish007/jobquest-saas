import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Sparkles, GripVertical } from 'lucide-react';

const JobCard = ({ job, onOpenAi }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id });



    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{job.job_title}</h3>
                        <p className="text-xs font-medium text-gray-500">{job.company_name}</p>
                    </div>
                </div>
                <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-all">
                    <GripVertical size={16} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Full Time
                </span>
                <span className="text-xs text-gray-400">2d ago</span>

                {/* AI Trigger */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenAi(job);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="ml-auto p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                    title="Open Career Copilot"
                >
                    <Sparkles size={14} />
                </button>
            </div>


        </div>
    );
};

export default JobCard;
