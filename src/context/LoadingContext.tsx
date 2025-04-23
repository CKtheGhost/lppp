// src/context/LoadingContext.tsx
import React, { createContext, useContext, useState } from 'react';
import QuantumSpinner from '@/components/QuantumSpinner';

interface LoadingContextType {
  showLoading: (options?: { 
    theme?: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi', 
    message?: string,
    progress?: number,
    showProgress?: boolean
  }) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
}

interface LoadingOptions {
  theme: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  message: string;
  progress: number;
  showProgress: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<LoadingOptions>({ 
    theme: 'green', 
    message: 'Loading...', 
    progress: 0,
    showProgress: false
  });
  
  const showLoading = (opts = {}) => {
    setOptions({ ...options, ...opts });
    setLoading(true);
  };
  
  const hideLoading = () => setLoading(false);
  
  const updateProgress = (progress: number) => {
    setOptions(prev => ({
      ...prev,
      progress
    }));
  };
  
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, updateProgress }}>
      {children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/60 backdrop-blur-sm">
          <QuantumSpinner 
            size={100} 
            theme={options.theme} 
            showLabel={true} 
            labelText={options.message}
            showProgress={options.showProgress}
            progress={options.progress}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;