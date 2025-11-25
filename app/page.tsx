import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-900">Jobify</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Stop using spreadsheets. <br />
          <span className="text-blue-600">Start getting hired.</span>
        </h1>
        
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Jobify creates a personalized Kanban board for your job search. 
          Track applications, organize interviews, and get AI-powered career advice in seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            href="/signup" 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Start Tracking for Free <ArrowRight size={20} />
          </Link>
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition"
          >
            I have an account
          </Link>
        </div>

        {/* --- SOCIAL PROOF / FEATURES --- */}
        <div className="flex flex-wrap justify-center gap-8 text-gray-600 font-medium mb-16">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} /> Organized Pipeline
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} /> AI Interview Prep
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} /> 100% Free
          </div>
        </div>

        {/* --- DASHBOARD PREVIEW IMAGE --- */}
        <div className="relative mx-auto max-w-5xl rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* NOTE: Make sure you put 'dashboard-preview.png' inside your /public folder! 
               If you don't have it yet, this will show a broken image icon.
            */}
            <Image 
              src="/dashboard-preview.png" 
              alt="Jobify Dashboard Preview" 
              width={1200} 
              height={675} 
              className="w-full h-auto"
              priority
            />
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 Jobify. Built with Next.js</p>
        </div>
      </footer>

    </div>
  );
}