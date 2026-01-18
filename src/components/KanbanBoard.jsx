import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Loader2, Plus } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';
import { supabase } from '../lib/supabase';
import AddJobModal from './AddJobModal';
import AiAssistantModal from './AiAssistantModal';
import EmptyState from './EmptyState';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({
        wishlist: [],
        applied: [],
        interview: [],
        offer: []
    });
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobForAi, setSelectedJobForAi] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const normalize = (status) => status ? status.toLowerCase() : 'wishlist';

    const fetchApplications = async () => {
        setLoading(true);
        console.log("Attempting to fetch from Supabase...");
        const { data, error } = await supabase
            .from('applications')
            .select('*');

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Raw Data from DB:", data);

            if (data) {
                setColumns({
                    wishlist: data.filter(job => normalize(job.status) === 'wishlist'),
                    applied: data.filter(job => normalize(job.status) === 'applied'),
                    interview: data.filter(job => normalize(job.status) === 'interview'),
                    offer: data.filter(job => normalize(job.status) === 'offer'),
                });
            }
        }
        setLoading(false);
    };

    const updateApplicationStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('applications')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating application status:', error);
        }
    };

    const handleDeleteJob = async (jobId) => {
        // Optimistic update
        setColumns(prev => {
            const newColumns = { ...prev };
            Object.keys(newColumns).forEach(key => {
                newColumns[key] = newColumns[key].filter(job => job.id !== jobId);
            });
            return newColumns;
        });

        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', jobId);

        if (error) {
            console.error('Error deleting application:', error);
            // Optionally revert optimistic update here, but for now we'll imply success
            fetchApplications(); // Re-fetch to ensure sync
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id) => {
        if (id in columns) {
            return id;
        }
        return Object.keys(columns).find((key) =>
            columns[key].find((item) => item.id === id)
        );
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (overId == null || active.id in columns) {
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setColumns((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const overId = over?.id;

        // 1. Log the Raw Event
        console.log('🔄 DRAG END:', event);

        if (!overId) {
            console.log('❌ No destination defined (dropped outside)');
            setActiveId(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        // 2. Log the Intent
        console.log(`📝 Attempting to move Job ID ${active.id} to Status: "${overContainer}" (from "${activeContainer}")`);

        if (activeContainer && overContainer) {
            // FIX: Always update Supabase with the destination container (overContainer).
            // Logic: activeContainer IS overContainer here because DragOver updated local state.

            // 4. The Database Commit (Explicit Await with try/catch)
            try {
                const { data, error } = await supabase
                    .from('applications')
                    .update({ status: overContainer })
                    .eq('id', active.id)
                    .select(); // .select() forces return data to verify

                if (error) {
                    console.error('🔥 SUPABASE ERROR:', error);
                    alert('Failed to save move: ' + error.message);
                    fetchApplications(); // Revert/Refresh
                } else {
                    console.log('✅ Supabase Success:', data);
                }
            } catch (err) {
                console.error('💥 UNEXPECTED ERROR:', err);
                alert('Unexpected error saving move.');
            }

            // Reordering logic
            if (activeContainer === overContainer) {
                const activeIndex = columns[activeContainer].findIndex((item) => item.id === active.id);
                const overIndex = columns[overContainer].findIndex((item) => item.id === overId);

                if (activeIndex !== overIndex) {
                    setColumns((prev) => ({
                        ...prev,
                        [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                    }));
                }
            }
        }

        setActiveId(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const activeItem = activeId ? (
        Object.keys(columns).reduce((found, key) => {
            if (found) return found;
            return columns[key].find(item => item.id === activeId);
        }, undefined)
    ) : null;



    const totalJobs = Object.values(columns).reduce((acc, col) => acc + col.length, 0);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Empty State Check
    if (totalJobs === 0 && !loading) {
        return (
            <div className="flex h-full flex-col">
                <EmptyState onAddJob={() => setIsModalOpen(true)} />
                <AddJobModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onJobAdded={fetchApplications}
                />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex h-16 items-center justify-between bg-white px-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pipeline</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-[#0F1117] px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition-colors"
                    >
                        <Plus size={16} />
                        Add Job
                    </button>
                </div>
            </div>

            {/* Board Canvas */}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex h-full items-start gap-6">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <KanbanColumn id="wishlist" title="Wishlist" jobs={columns.wishlist} onOpenAi={setSelectedJobForAi} onDelete={handleDeleteJob} />
                        <KanbanColumn id="applied" title="Applied" jobs={columns.applied} onOpenAi={setSelectedJobForAi} onDelete={handleDeleteJob} />
                        <KanbanColumn id="interview" title="Interview" jobs={columns.interview} onOpenAi={setSelectedJobForAi} onDelete={handleDeleteJob} />
                        <KanbanColumn id="offer" title="Offer" jobs={columns.offer} onOpenAi={setSelectedJobForAi} onDelete={handleDeleteJob} />

                        <DragOverlay dropAnimation={dropAnimation}>
                            {activeItem ? <JobCard job={activeItem} /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobAdded={fetchApplications}
            />

            <AiAssistantModal
                isOpen={!!selectedJobForAi}
                job={selectedJobForAi}
                onClose={() => setSelectedJobForAi(null)}
            />
        </div>
    );

};

export default KanbanBoard;
