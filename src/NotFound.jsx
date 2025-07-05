import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-8">
      <div className="text-7xl mb-4">🍼🤱</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Oopsie! We can't explain what's not there.</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Looks like you crawled into a page that doesn't exist. Let's get you back to the playroom!</p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200"
      >
        🏠 Go Home
      </button>
    </div>
  );
} 