import { Button } from "./ui/button";
import React from "react";

const ButtonPrimary: React.FC<React.ComponentProps<typeof Button>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      className={`uppercase transition-all duration-200 ease-in-out w-full border border-white text-white font-bold py-5 bg-transparent
        hover:bg-white hover:text-violet-500 shadow-[0_0_10px_#8b5cf6,0_0_20px_#8b5cf6] ${className ?? ""}`}
    >
      {children}
    </Button>
  );
};

export default ButtonPrimary;
