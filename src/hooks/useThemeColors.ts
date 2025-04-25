// src/hooks/useThemeColors.ts
import { useMemo } from 'react';

export function useThemeColors(colorScheme: string) {
  return useMemo(() => {
    const themes = {
      green: {
        primary: '#00ff00',
        secondary: '#00cc44',
        tertiary: '#003300',
        accent: '#33ff33',
        background: '#001100',
        data: '#ccffcc',
        glow: 'rgba(0, 255, 0, 0.7)'
      },
      blue: {
        primary: '#0088ff',
        secondary: '#00ccff',
        tertiary: '#000066',
        accent: '#33ccff',
        background: '#000033',
        data: '#ccf5ff',
        glow: 'rgba(0, 136, 255, 0.7)'
      },
      purple: {
        primary: '#aa00ff',
        secondary: '#cc66ff',
        tertiary: '#330066',
        accent: '#dd99ff',
        background: '#110022',
        data: '#eeccff',
        glow: 'rgba(170, 0, 255, 0.7)'
      },
      red: {
        primary: '#ff3311',
        secondary: '#ff6644',
        tertiary: '#660000',
        accent: '#ff9977',
        background: '#110000',
        data: '#ffcccc',
        glow: 'rgba(255, 51, 17, 0.7)'
      },
      cyan: {
        primary: '#00ffff',
        secondary: '#66ffff',
        tertiary: '#006666',
        accent: '#99ffff',
        background: '#001111',
        data: '#ccffff',
        glow: 'rgba(0, 255, 255, 0.7)'
      },
      multi: {
        primary: '#00ff00',
        secondary: '#00ccff',
        tertiary: '#aa00ff',
        accent: '#ff3311',
        background: '#000022',
        data: '#ffffff',
        glow: 'rgba(0, 255, 102, 0.7)'
      }
    };
    
    return themes[colorScheme as keyof typeof themes] || themes.green;
  }, [colorScheme]);
}