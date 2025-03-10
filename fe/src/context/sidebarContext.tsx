import { createContext, ReactNode, useContext, useState } from "react";

interface SidebarContextProps {
   showSidebar: boolean;
   setShowSidebar: (showSidebar: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
   showSidebar: true,
   setShowSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
   const [showSidebar, setShowSidebar] = useState(true);

   return (
      <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
         {children}
      </SidebarContext.Provider>
   );
};
