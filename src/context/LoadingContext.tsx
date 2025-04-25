'use client';

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import QuantumSpinner from '@/components/QuantumSpinner';

interface LoadingState {
  isLoading: boolean;
  theme: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  message: string;
  progress: number;
  showProgress: boolean;
}

type LoadingAction =
  | { type: 'SHOW_LOADING'; payload: Partial<LoadingState> }
  | { type: 'HIDE_LOADING' }
  | { type: 'UPDATE_PROGRESS'; payload: number };

interface LoadingContextType {
  state: LoadingState;
  showLoading: (options?: Partial<LoadingState>) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
}

const initialState: LoadingState = {
  isLoading: false,
  theme: 'green',
  message: 'Loading...',
  progress: 0,
  showProgress: false,
};

const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case 'SHOW_LOADING':
      return {
        ...state,
        isLoading: true,
        ...action.payload,
      };
    case 'HIDE_LOADING':
      return {
        ...state,
        isLoading: false,
        progress: 0,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.payload,
      };
    default:
      return state;
  }
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  
  const showLoading = useCallback((options: Partial<LoadingState> = {}) => {
    dispatch({ type: 'SHOW_LOADING', payload: options });
  }, []);
  
  const hideLoading = useCallback(() => {
    dispatch({ type: 'HIDE_LOADING' });
  }, []);
  
  const updateProgress = useCallback((progress: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  }, []);
  
  const contextValue = useMemo(() => ({
    state,
    showLoading,
    hideLoading,
    updateProgress,
  }), [state, showLoading, hideLoading, updateProgress]);
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {state.isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/60 backdrop-blur-sm">
          <QuantumSpinner
            size={100}
            theme={state.theme}
            showLabel={true}
            labelText={state.message}
            showProgress={state.showProgress}
            progress={state.progress}
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