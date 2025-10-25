import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
        <p className="text-slate-500 text-lg">MOM is creating your plan...</p>
        <p className="text-slate-400 text-sm max-w-xs text-center">Generating a balanced schedule to help you achieve your goals. Hang tight!</p>
    </div>
  );
};

export default LoadingSpinner;