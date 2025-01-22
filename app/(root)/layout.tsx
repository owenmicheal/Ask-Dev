import Navbar from "@/components/navigation/navbar";
import React, { ReactNode } from "react";

const Rootelayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default Rootelayout;
