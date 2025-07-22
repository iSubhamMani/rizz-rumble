import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<
  PrimaryButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...rest }) => {
  return (
    <button
      type="button"
      className={`
        group relative px-6 py-4 
        bg-gradient-to-b from-yellow-600 to-amber-700/40
        hover:from-yellow-500 hover:to-amber-700/40

        border-2 border-amber-900 
        rounded-none
        transform transition-all duration-300 
        hover:shadow-2xl
        font-secondary text-sm sm:text-lg text-amber-100
        shadow-lg
        ${className}
      `}
      {...rest}
    >
      {/* Button content */}
      {children}
    </button>
  );
};

export default PrimaryButton;
