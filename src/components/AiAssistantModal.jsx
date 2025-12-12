import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Wand2 } from 'lucide-react';

const AiAssistantModal = ({ isOpen, onClose, job }) => {
    const [activeTab, setActiveTab] = useState('cover');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeContent, setResumeContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');

    if (!isOpen) return null;

    const tabs = [
        { id: 'cover', label: 'Cover Letter' },
        { id: 'resume', label: 'Resume Fixer' },
        { id: 'interview', label: 'Interview Prep' }
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResult(''); // Clear previous result

        try {
            const response = await fetch('http://localhost:8000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: activeTab,
                    job_description: jobDescription,
                    user_resume: resumeContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            console.error("Error generating content:", error);
            setResult("An error occurred while generating content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="fixed left-[50%] top-[50%] z-[9999] grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-xl font-bold text-gray-900">Career Copilot</h2>
                        </div>
                        <p className="text-sm text-gray-500">
                            Assisting with <span className="font-semibold text-gray-900">{job?.job_title}</span> at <span className="font-semibold text-gray-900">{job?.company_name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Job Description</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Paste JD here for context..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">My Resume</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Paste your resume content..."
                                value={resumeContent}
                                onChange={(e) => setResumeContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full inline-flex h-11 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Generate with AI ✨
                            </>
                        )}
                    </button>

                    {/* AI Result */}
                    {result && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">AI Suggestion</h3>
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="text-xs text-gray-500 hover:text-gray-900"
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AiAssistantModal;
