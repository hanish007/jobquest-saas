import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, TrendingUp, Users, AlertCircle, Briefcase, Calendar } from 'lucide-react';
import EmptyState from './EmptyState';
import AddJobModal from './AddJobModal';
import SkeletonLoader from './SkeletonLoader';

const DashboardHome = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // console.log("DashboardHome mounted. Fetching fresh data...");
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
        } else {
            // console.log("Fetched jobs:", data?.length);
            setJobs(data || []);
        }
        setLoading(false);
    };

    // Metrics - Calculated from fresh 'jobs' state
    const totalJobs = jobs.length;
    const activeInterviews = jobs.filter(job => job.status?.toLowerCase() === 'interview').length;
    const actionRequired = jobs.filter(job => job.status?.toLowerCase() === 'applied').length;

    const recentJobs = jobs.slice(0, 5);
    const upcomingInterviews = jobs.filter(job => job.status?.toLowerCase() === 'interview').slice(0, 3);

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-8">
                <header className="mb-8">
                    <SkeletonLoader className="h-8 w-48 mb-2" />
                    <SkeletonLoader className="h-4 w-96" />
                </header>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <SkeletonLoader className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <SkeletonLoader className="h-4 w-24" />
                                    <SkeletonLoader className="h-8 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm h-64">
                            <SkeletonLoader className="h-6 w-32 mb-4" />
                            <div className="space-y-4">
                                <SkeletonLoader className="h-12 w-full" />
                                <SkeletonLoader className="h-12 w-full" />
                                <SkeletonLoader className="h-12 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (totalJobs === 0) {
        return (
            <>
                <EmptyState onAddJob={() => setIsModalOpen(true)} />
                <AddJobModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onJobAdded={fetchJobs}
                />
            </>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening with your job search.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Applications</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalJobs}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Interviews</p>
                            <h3 className="text-2xl font-bold text-gray-900">{activeInterviews}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Action Required</p>
                            <h3 className="text-2xl font-bold text-gray-900">{actionRequired}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                        {recentJobs.length > 0 ? (
                            recentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-500">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{job.job_title}</p>
                                            <p className="text-xs text-gray-500">{job.company_name}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
                                        {job.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Interviews</h3>
                    </div>
                    <div className="space-y-4">
                        {upcomingInterviews.length > 0 ? (
                            upcomingInterviews.map((job) => (
                                <div key={job.id} className="flex items-start gap-4 rounded-lg bg-purple-50 p-4">
                                    <div className="mt-1 text-purple-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{job.job_title} at {job.company_name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">Make sure to prepare specific questions for the team.</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                                <p>No active interviews currently.</p>
                                <p className="text-sm">Keep applying!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobAdded={fetchJobs}
            />
        </div>
    );
};


export default DashboardHome;
