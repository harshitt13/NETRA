import React from 'react';
import { Loader2 } from 'lucide-react'; // Using a specific loader icon

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger'
  disabled = false,
  isLoading = false,
  icon: Icon, // Pass icon component as a prop, e.g., icon={Plus}
  className = '',
  ...props
}) => {

  const baseStyles = `
    relative flex items-center justify-center h-12 px-6 font-semibold rounded-lg 
    transition-all duration-300 ease-in-out overflow-hidden group
    focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50
  `;

  const variantStyles = {
    primary: `
      bg-cyan-600/70 text-white border border-cyan-500/50
      hover:bg-cyan-500/80 hover:shadow-cyan-500/40 hover:shadow-lg
      focus:ring-cyan-500/50
      disabled:bg-cyan-800/50
    `,
    secondary: `
      bg-gray-700/60 text-gray-200 border border-gray-600/80
      hover:bg-gray-600/70 hover:shadow-gray-600/30 hover:shadow-md
      focus:ring-gray-500/50
      disabled:bg-gray-800/50
    `,
    danger: `
      bg-red-600/70 text-white border border-red-500/50
      hover:bg-red-500/80 hover:shadow-red-500/40 hover:shadow-lg
      focus:ring-red-500/50
      disabled:bg-red-800/50
    `
  };

  // Glow effect for primary and danger variants
  const glowEffect = (
    <span
      className={`absolute top-0 left-1/2 w-[200%] h-[300%] -translate-x-1/2 -translate-y-[60%] 
      bg-gradient-radial from-white/30 via-white/5 to-transparent 
      transition-transform duration-700 ease-in-out
      group-hover:translate-y-[-10%]
      ${variant === 'secondary' ? 'hidden' : ''}`}
    />
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {glowEffect}
      <span className="relative z-10 flex items-center">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {Icon && <Icon className="mr-2 -ml-1 h-5 w-5" />}
            {children}
          </>
        )}
      </span>
    </button>
  );
};

export default Button;
