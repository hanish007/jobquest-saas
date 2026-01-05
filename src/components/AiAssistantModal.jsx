import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Wand2, Copy, Check } from 'lucide-react';

const AiAssistantModal = ({ isOpen, onClose, job }) => {
    const [activeTab, setActiveTab] = useState('cover');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeContent, setResumeContent] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const tabs = [
        { id: 'cover', label: 'Cover Letter' },
        { id: 'resume', label: 'Resume Matcher' },
        { id: 'interview', label: 'Interview Prep' }
    ];

    const handleCopyAdvice = async () => {
        if (result?.advice) {
            await navigator.clipboard.writeText(result.advice);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResult(null); // Clear previous result
        setIsCopied(false);

        try {
            let response;
            if (activeTab === 'resume') {
                if (!resumeFile) {
                    alert("Please upload a PDF resume.");
                    setIsGenerating(false);
                    return;
                }
                const formData = new FormData();
                formData.append('resume', resumeFile);
                formData.append('job_description', jobDescription);

                const API_URL = import.meta.env.VITE_API_URL || 'https://jobquest-backend-ip8m.onrender.com';
                response = await fetch(`${API_URL}/api/analyze-resume`, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                const API_URL = import.meta.env.VITE_API_URL || 'https://jobquest-backend-ip8m.onrender.com';
                response = await fetch(`${API_URL}/api/generate`, {
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
            }

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await response.json();
            // content might be in 'result' (text) or directly in data (json for resume)
            setResult(data.result || data);
        } catch (error) {
            console.error("Error generating content:", error);
            setResult("An error occurred while generating content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    const renderResult = () => {
        if (!result) return null;

        if (activeTab === 'resume' && typeof result === 'object') {
            return (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Match Score</h3>
                            <span className={`text-lg font-bold ${result.match_score >= 80 ? 'text-green-600' : result.match_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {result.match_score}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${result.match_score >= 80 ? 'bg-green-600' : result.match_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${result.match_score}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-red-600 mb-2">Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.missing_keywords && result.missing_keywords.map((keyword, index) => (
                                <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Advice</h3>
                            <button
                                onClick={handleCopyAdvice}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="h-3 w-3" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        <span>Copy Advice</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                            {result.advice}
                        </p>
                    </div>
                </div>
            );
        }

        // Default text result
        return (
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
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="fixed left-[50%] top-[50%] z-[9999] flex flex-col w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-hidden">
                {/* Fixed Header Section (Title + Tabs) */}
                <div className="flex-shrink-0 border-b bg-white z-10">
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

                    {/* Tabs - Moved to Header */}
                    <div className="flex border-b border-gray-200 px-6 pt-2">
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
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
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
                            <label className="text-sm font-medium leading-none">
                                {activeTab === 'resume' ? 'Upload Resume (PDF)' : 'My Resume Content'}
                            </label>
                            {activeTab === 'resume' ? (
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                                            {resumeFile && <p className="mt-2 text-sm font-medium text-indigo-600">{resumeFile.name}</p>}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => setResumeFile(e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Paste your resume content..."
                                    value={resumeContent}
                                    onChange={(e) => setResumeContent(e.target.value)}
                                />
                            )}
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
                                {activeTab === 'resume' ? 'Analyzing...' : 'Generating Magic...'}
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                {activeTab === 'resume' ? 'Analyze Match' : 'Generate with AI ✨'}
                            </>
                        )}
                    </button>

                    {/* AI Result */}
                    {renderResult()}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AiAssistantModal;
