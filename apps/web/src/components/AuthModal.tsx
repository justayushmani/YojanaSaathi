import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceOpen?: boolean;
}

export default function AuthModal({ isOpen, onClose, forceOpen = false }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const apiUrl = ""; // Handled by Next.js rewrites proxy
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      setUser(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-4xl font-black uppercase">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          {!forceOpen && (
            <button 
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <X size={24} strokeWidth={3} />
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-200 border-2 border-red-600 text-red-800 font-bold p-3 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-sm">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-black p-3 font-bold bg-[#f0f0f0] focus:bg-white shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none focus:border-[#FF5A00]"
                required
              />
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-sm">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black p-3 font-bold bg-[#f0f0f0] focus:bg-white shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none focus:border-[#FF5A00]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-sm">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-black p-3 font-bold bg-[#f0f0f0] focus:bg-white shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none focus:border-[#FF5A00]"
              required
            />
          </div>

          <button 
            type="submit"
            className="mt-4 bg-[#1D4ED8] text-white border-4 border-black px-4 py-3 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF5A00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center font-bold">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#FF5A00] underline uppercase hover:text-black"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
