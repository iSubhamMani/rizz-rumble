import React from "react";

interface StyledButtonPrimaryProps {
  children: React.ReactNode;
  className?: string;
}

const StyledButtonPrimary: React.FC<
  StyledButtonPrimaryProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...rest }) => {
  return (
    <button
      type="button"
      className={`
        group relative px-12 py-4 
        bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800
        hover:from-amber-500 hover:via-amber-600 hover:to-amber-700
        border-4 border-amber-900 
        rounded-none
        transform transition-all duration-300 
        hover:scale-105 hover:shadow-2xl
        active:scale-95
        font-secondary text-sm sm:text-lg md:text-xl text-amber-100
        shadow-lg
        wood-texture
        ${className}
      `}
      {...rest}
    >
      {/* Wood grain overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-800/20 to-amber-900/40 rounded-none" />

      {/* Metal corner brackets */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600" />

      {/* Button content */}
      {children}

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none" />
    </button>
  );
};

export default StyledButtonPrimary;
