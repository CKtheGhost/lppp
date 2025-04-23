// src/utils/apiUtils.ts
import { useState } from 'react';

export async function submitRegistration(formData: Record<string, any>) {
  try {
    const response = await fetch('https://api.prospera.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting registration:', error);
    throw error;
  }
}

// Hook for managing API loading states
export function useApiStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Wrapper for submitRegistration with loading state
  const submitRegistrationWithLoading = async (formData: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitRegistration(formData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    isLoading, 
    error, 
    submitRegistrationWithLoading 
  };
}