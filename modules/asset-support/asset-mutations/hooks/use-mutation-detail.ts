"use client";

import { useEffect, useState } from "react";

import { getMutationById }
from "../services/asset-mutation-service";

import { AssetMutation }
from "../types/AssetMutation";

export function useMutationDetail(
  id: number | null,
  open: boolean
) {

  const [
    mutation,
    setMutation,
  ] = useState<any>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {

    if (!open || !id)
      return;

    load();

  }, [id, open]);

  async function load() {

    try {

      setLoading(true);

      const data =
        await getMutationById(id!);

      setMutation(data);

    } finally {

      setLoading(false);

    }

  }

  return {

    mutation,

    loading,

  };

}