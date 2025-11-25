'use client'

import { updateJob, deleteJob, generateJobSpecificAdvice } from "@/lib/actions"; 
import { useActionState, useState } from "react";
import Link from "next/link";
import { Trash2, AlertTriangle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function EditJobForm({ job }: { job: any }) {
  const [state, formAction, isPending] = useActionState(updateJob, { error: '' });
  const deleteJobWithId = deleteJob.bind(null, job.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async () => {
    setAiLoading(true);
    const result = await generateJobSpecificAdvice(job.id);
    
    if (result.advice) {
      setAiAdvice(result.advice);
    } else {
      alert("Error: " + (result.error || "Unknown error"));
    }
    setAiLoading(false);
  };

  return (
    <>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="jobId" value={job.id} />

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-900">Company</label>
            <input name="company" defaultValue={job.company} required className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900" />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-900">Position</label>
            <input name="position" defaultValue={job.position} required className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900" />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Status</label>
          <select name="status" defaultValue={job.status} className="w-full p-2 border rounded border-gray-300 text-gray-900">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Description / Notes</label>
          <textarea 
            name="description" 
            defaultValue={job.description || ''} 
            rows={6}
            className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900" 
            placeholder="Paste job description here for better AI analysis..."
          />
        </div>

        {/* AI COACH SECTION */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <Sparkles size={18} /> Jobify Strategy
                </h3>
                {!aiAdvice && (
                    <button
                        type="button"
                        onClick={handleAskAI}
                        disabled={aiLoading}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {aiLoading ? "Analyzing..." : "Generate Strategy"}
                    </button>
                )}
            </div>

            {/* >>> THIS IS THE PART I CHANGED <<< */}
            {aiAdvice && (
                <div className="bg-white p-4 rounded border border-blue-100 animate-in fade-in">
                    {/* We use 'prose' class to automatically style the headers/lists */}
                    <article className="prose prose-sm prose-blue max-w-none text-blue-900">
                        <ReactMarkdown>{aiAdvice}</ReactMarkdown>
                    </article>
                </div>
            )}
            
            {!aiAdvice && !aiLoading && (
                <p className="text-sm text-blue-600 italic">
                    Click generate to get interview questions and tips for this specific role.
                </p>
            )}
        </div>

        {state?.error && <p className="text-red-500 text-center">{state.error}</p>}

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t mt-4">
          <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              className="w-1/3 flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200"
          >
            <Trash2 size={18} /> Delete
          </button>

          <button 
              type="submit" 
              disabled={isPending} 
              className="w-2/3 p-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Update Job'}
          </button>
        </div>
      </form>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Job?</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete <span className="font-semibold text-gray-800">{job.company}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              
              <form action={deleteJobWithId} className="flex-1">
                 <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                 >
                   Delete
                 </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}