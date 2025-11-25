'use client'

import { signup } from "@/lib/actions";
import Link from "next/link";
import { useActionState } from "react"; 

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, { error: null });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Create an Account</h2>
        
        {state?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {state.error}
            </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full mt-1 p-2 border rounded border-gray-300 text-gray-900"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-900">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}