import React from 'react';
import { ArrowRight, Layout, Sparkles, MessageSquare } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-gray-100 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900 tracking-tight">JobQuest AI</span>
                    </div>
                    <button
                        onClick={onGetStarted}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                            Your AI Career Copilot
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 mb-10">
                            Track applications, analyze resumes, and prepare for interviews—all in one place.
                            Supercharge your job hunt with AI-powered insights.
                        </p>
                        <div className="flex items-center justify-center gap-x-6">
                            <button
                                onClick={onGetStarted}
                                className="rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 hover:scale-105 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
                            >
                                Get Started for Free <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Features Grid */}
            <div className="bg-gray-50/50 py-24 sm:py-32 border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <Layout className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-2">
                                Smart Tracking
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Kanban board for your job hunt. Visualize your progress from wishlist to offer letter with drag-and-drop simplicity.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-2">
                                Resume Matcher
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get AI feedback on your resume PDF. Compare it against job descriptions to increase your match score.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-2">
                                Interview Prep
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Practice with custom AI-generated questions tailored specifically to the job description you're applying for.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex justify-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} JobQuest AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
