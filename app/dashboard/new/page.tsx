'use client'

import { createJob } from "@/lib/actions";
import { useActionState } from "react";
import Link from "next/link";

export default function NewJobPage() {
  const [state, formAction, isPending] = useActionState(createJob, { error: '' });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Track a New Job</h1>
      
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Company</label>
          <input name="company" required className="w-full p-2 border rounded border-gray-300 text-gray-900" placeholder="e.g. Google" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Position</label>
          <input name="position" required className="w-full p-2 border rounded border-gray-300 text-gray-900" placeholder="e.g. Frontend Engineer" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Job Description / Notes</label>
          <textarea 
            name="description" 
            rows={4}
            className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900" 
            placeholder="Paste the job requirements or add your own notes here..." 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Status</label>
          <select name="status" className="w-full p-2 border rounded border-gray-300 text-gray-900">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex gap-4 pt-2">
          <Link href="/dashboard" className="w-1/3 text-center p-2 text-gray-600 border rounded hover:bg-gray-100">
            Cancel
          </Link>
          <button type="submit" disabled={isPending} className="w-2/3 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Job'}
          </button>
        </div>
        
        {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
      </form>
    </div>
  );
}