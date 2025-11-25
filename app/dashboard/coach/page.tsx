'use client'

// IMPORT THE GLOBAL FUNCTION
import { generateGlobalAdvice } from "@/lib/actions";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function CoachPage() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // CALL THE GLOBAL FUNCTION
    const result = await generateGlobalAdvice();
    
    if (result.advice) {
      setAdvice(result.advice);
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} className="mr-2" /> Back to Board
      </Link>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900"> Jobify Career Coach</h1>
          <p className="text-gray-500 mt-2">
            Analyze your entire job search progress to get strategic advice.
          </p>
        </div>

        {!advice && (
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Analyzing all jobs...' : 'Generate Global Report'}
          </button>
        )}

        {advice && (
          <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4">Your Weekly Strategy:</h3>
            <div className="prose text-blue-800 whitespace-pre-wrap">
              {advice}
            </div>
            <button 
              onClick={() => setAdvice(null)}
              className="mt-6 text-sm text-blue-600 hover:underline"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}