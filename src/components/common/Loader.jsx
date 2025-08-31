import React from 'react';

const Loader = ({ message = 'Loading System Data...' }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm"
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer rotating circle */}
        <div className="absolute w-full h-full border-4 border-cyan-500/30 rounded-full"></div>
        {/* Inner rotating arc */}
        <div
          className="absolute w-full h-full border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"
          style={{ animationDuration: '1.2s' }}
        ></div>

        {/* Pulsing center eye logo */}
        <div className="absolute w-16 h-16 flex items-center justify-center">
            <div className="w-10 h-10 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,174,239,0.8)]">
                <div className="w-5 h-5 bg-white rounded-full m-auto mt-[10px]"></div>
            </div>
        </div>
      </div>
      <p className="mt-8 text-xl font-semibold text-cyan-300 tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;

