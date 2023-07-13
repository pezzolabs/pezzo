import { createContext, useContext, useState } from "react";

interface PromptVersionEditorContext {
  content: any; // TODO
  setContent: (content: any) => void; // TODO
  settings: any; // TODO
  setSettings: (settings: any) => void; // TODO
}

const PromptVersionEditorContext =
  createContext<PromptVersionEditorContext>(null);

export const usePromptVersionEditorContext = () => {
  return useContext(PromptVersionEditorContext);
};

export const PromptVersionEditorProvider = ({ children }) => {
  const [content, setContent] = useState<any>(undefined); // TODO
  const [settings, setSettings] = useState<any>(undefined); // TODO

  const value = {
    content,
    setContent,
    settings,
    setSettings,
  };

  return (
    <PromptVersionEditorContext.Provider value={value}>
      {children}
    </PromptVersionEditorContext.Provider>
  );
};
