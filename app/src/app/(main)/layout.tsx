import { SocketProvider } from "@/context/SocketContext";
import React from "react";

const MainGameLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default MainGameLayout;
