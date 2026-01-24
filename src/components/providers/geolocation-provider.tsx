'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface GeolocationContextType {
  location: { lat: number; lng: number } | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined
);

export function GeolocationProvider({
  children,
  autoRequest = false,
}: {
  children: React.ReactNode;
  autoRequest?: boolean;
}) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest]);

  return (
    <GeolocationContext.Provider
      value={{ location, error, isLoading, requestLocation }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};
