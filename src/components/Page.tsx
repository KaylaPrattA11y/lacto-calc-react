import React, { useEffect, useState } from "react";
import getClientEnv from "../utils/getClientEnv";
import { ToastContainer } from "react-toastify";
import InstallPwaPrompt from "./InstallPwaPrompt";
import Tabs from "./Tabs";
import Calculator from "./calculator-parts/Calculator";
import FermentList from "./ferment-list/FermentList";
import Spinner from "./Spinner";

export default function Page({ pageTitle, children }: { pageTitle: string; children?: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 900px)").matches;
  });
  const clientEnv = getClientEnv();

  const tabs = [
    {
      id: 'calculator',
      label: <h2>Calculator</h2>,
      content: <Calculator />,
    },
    {
      id: 'ferment-list',
      label: <h2>Saved Ferments</h2>,
      content: <FermentList />,
    }
  ];
  
  // Track screen size to switch tab orientation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const handleChange = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    // Set initial value and subscribe to changes
    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Loading state management
  useEffect(() => {
    window.addEventListener('fermentDataUpdated', () => setIsLoading(false));

    setIsLoading(false);
    return () => {
      window.removeEventListener('fermentDataUpdated', () => setIsLoading(false));
    };

  }, []);

  return (
    isLoading ? (
      <Spinner />
    ) : (
    <div className="page-wrapper">
      <main className="page-main" data-client-env={clientEnv}>
        <h1 className="visually-hidden">{pageTitle}</h1>
        <Tabs 
          tabs={tabs} 
          orientation={isSmallScreen ? "horizontal" : "vertical"}
        />
        {children}
        <ToastContainer theme="dark" autoClose={8000} />
      </main>
      <footer className="site-footer">
        <small>This little tool was created by Kayla Pratt. <a href="https://github.com/KaylaPrattA11y/lacto-calc-react" target="_blank" rel="noopener noreferrer">View on Github</a></small>
        <InstallPwaPrompt />
      </footer>
    </div>
    )
  );
}