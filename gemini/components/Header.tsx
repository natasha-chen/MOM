
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
              MOM
            </h1>
            <p className="text-slate-500 text-sm md:text-base">Your personal Manager of Moments</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
