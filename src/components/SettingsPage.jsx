import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Save, LogOut, Loader2 } from 'lucide-react';

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('Mid');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setFullName(user.user_metadata?.full_name || '');
                    setJobTitle(user.user_metadata?.job_title || '');
                    setExperienceLevel(user.user_metadata?.experience_level || 'Mid');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    job_title: jobTitle,
                    experience_level: experienceLevel,
                }
            });

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="mx-auto max-w-2xl">
                <header className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your profile details and account preferences.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                                <User size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                                        Full Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="jobTitle" className="block text-sm font-medium leading-6 text-gray-900">
                                        Target Job Title <span className="text-gray-400 font-normal">(Used for AI context)</span>
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="jobTitle"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                            placeholder="Senior Frontend Engineer"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="experienceLevel" className="block text-sm font-medium leading-6 text-gray-900">
                                        Experience Level
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="experienceLevel"
                                            value={experienceLevel}
                                            onChange={(e) => setExperienceLevel(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                        >
                                            <option>Junior</option>
                                            <option>Mid</option>
                                            <option>Senior</option>
                                            <option>Lead/Principal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="rounded-xl border border-red-100 bg-red-50/30 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-red-900">Danger Zone</h2>
                                <p className="mt-1 text-sm text-red-600">
                                    Sign out of your account on this device.
                                </p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
