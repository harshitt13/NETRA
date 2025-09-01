import React from 'react';
import LoginForm from '../components/auth/LoginForm.jsx';

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '2rem 2rem'
        }}
      ></div>
      
      <div className="relative z-20">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
