// src/utils/apiUtils.ts

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
