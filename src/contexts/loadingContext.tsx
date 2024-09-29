import { Loading } from '@/components/loading';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    message: string;
    setIsLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    message: "",
    setIsLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoadingState] = useState(false);
    const [message, setMessage] = useState("");

    const setIsLoading = (loading: boolean, msg?: string) => {
        setIsLoadingState(loading);
        if (msg) {
            setMessage(msg);
        }
    };

    return (
        <LoadingContext.Provider value={{ isLoading, message, setIsLoading }}>
            {children}
            {isLoading && <Loading message={message} />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
