"use client";

import {
  useEffect,
  useState,
}
from "react";

import {

  getLocations,

  createLocation,

  updateLocation,

  toggleLocation,

}
from "../services/security-location-service";

export function useSecurityLocation() {

  const [
    locations,
    setLocations,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function loadLocations() {

    try {

      setLoading(true);

      const data =
        await getLocations();

      setLocations(
        data || []
      );

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadLocations();

  }, []);

  return {

    locations,

    loading,

    loadLocations,

    createLocation,

    updateLocation,

    toggleLocation,

  };

}