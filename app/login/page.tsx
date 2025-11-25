'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Use NextAuth's built-in signIn function
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        // Successful login
        router.push('/dashboard');
        router.refresh(); // Ensure the UI updates with the new session
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Login to Jobify</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-900" >
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}