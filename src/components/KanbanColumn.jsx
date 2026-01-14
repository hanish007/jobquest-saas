import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import JobCard from './JobCard';

const KanbanColumn = ({ id, title, jobs, onOpenAi, onDelete }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex h-full w-80 min-w-[320px] shrink-0 flex-col">
            <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                    {jobs.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className="flex flex-1 flex-col gap-3"
            >
                <SortableContext
                    id={id}
                    items={jobs.map(job => job.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} onOpenAi={onOpenAi} onDelete={onDelete} />
                    ))}
                </SortableContext>

                {jobs.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
