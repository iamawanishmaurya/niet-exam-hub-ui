import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Mode = "exam" | "ppt";

interface ModeContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    isTransitioning: boolean;
    setIsTransitioning: (v: boolean) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<Mode>(() => {
        const saved = localStorage.getItem("niet-hub-mode");
        return (saved === "ppt" || saved === "exam") ? saved : "exam";
    });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const setMode = (newMode: Mode) => {
        if (newMode === mode) return;
        setIsTransitioning(true);
        setModeState(newMode);
        localStorage.setItem("niet-hub-mode", newMode);
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, isTransitioning, setIsTransitioning }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = (): ModeContextType => {
    const ctx = useContext(ModeContext);
    if (!ctx) throw new Error("useMode must be used inside ModeProvider");
    return ctx;
};
