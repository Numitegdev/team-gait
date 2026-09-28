"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMutations,
} from "../services/asset-mutation-service";

import {
  AssetMutation,
} from "../types/AssetMutation";


interface MutationFilters {

  search: string;

  status: string;

  fromCompanyId: number | null;

  toCompanyId: number | null;

}


export function useMutations(

  filters: MutationFilters

) {

  const [

    mutations,

    setMutations,

  ] = useState<
    AssetMutation[]
  >([]);


  const [

    loading,

    setLoading,

  ] = useState(true);


  const [

    page,

    setPage,

  ] = useState(1);


  const [

    pageSize,

    setPageSizeState,

  ] = useState(10);


  const [

    total,

    setTotal,

  ] = useState(0);


  const totalPages =

    Math.ceil(

      total / pageSize

    );


  const loadMutations =

    useCallback(

      async (
        requestedPage = page
      ) => {

        try {

          setLoading(true);


          const result =
            await getMutations({

              page:
                requestedPage,

              pageSize,

              search:
                filters.search,

              status:
                filters.status,

              fromCompanyId:
                filters.fromCompanyId,

              toCompanyId:
                filters.toCompanyId,

            });


          setMutations(
            result.data
          );


          setTotal(
            result.total
          );


          setPage(
            requestedPage
          );


        } catch (error) {

          console.error(
            error
          );

        } finally {

          setLoading(false);

        }

      },

      [

        page,

        pageSize,

        filters.search,

        filters.status,

        filters.fromCompanyId,

        filters.toCompanyId,

      ]

    );


  // ==========================
  // FILTER BERUBAH
  // ==========================

  useEffect(() => {

    loadMutations(1);

  }, [

    filters.search,

    filters.status,

    filters.fromCompanyId,

    filters.toCompanyId,

    pageSize,

  ]);


  function setPageSize(

    size: number

  ) {

    setPageSizeState(size);

    setPage(1);

  }


  function nextPage() {

    if (
      page < totalPages
    ) {

      loadMutations(
        page + 1
      );

    }

  }


  function previousPage() {

    if (page > 1) {

      loadMutations(
        page - 1
      );

    }

  }


  return {

    mutations,

    loading,

    reload:
      () => loadMutations(page),

    page,

    pageSize,

    total,

    totalPages,

    setPageSize,

    nextPage,

    previousPage,

  };

}