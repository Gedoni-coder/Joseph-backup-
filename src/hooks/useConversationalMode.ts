import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ConversationalModeContextType {
  conversationalMode: boolean;
  setConversationalMode: (enabled: boolean) => void;
}

const ConversationalModeContext = createContext<
  ConversationalModeContextType | undefined
>(undefined);

export function ConversationalModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [conversationalMode, setConversationalModeState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("conversationalMode");
    if (saved !== null) {
      setConversationalModeState(saved === "true");
    }
    setIsLoaded(true);
  }, []);

  const setConversationalMode = (enabled: boolean) => {
    setConversationalModeState(enabled);
    localStorage.setItem("conversationalMode", String(enabled));
  };

  if (!isLoaded) {
    return React.createElement(React.Fragment, {}, children);
  }

  return React.createElement(
    ConversationalModeContext.Provider,
    { value: { conversationalMode, setConversationalMode } },
    children,
  );
}

export function useConversationalMode() {
  const context = useContext(ConversationalModeContext);
  if (!context) {
    throw new Error(
      "useConversationalMode must be used within ConversationalModeProvider",
    );
  }
  return context;
}
