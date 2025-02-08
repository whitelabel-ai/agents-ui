import React, { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthContext from '../context/AuthContext.Context';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {removeToken} = useContext(AuthContext);

  const onLogOut = () => removeToken?.();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>

          <h3 className='font-bold cursor-pointer' onClick={onLogOut}>Logout</h3>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
};