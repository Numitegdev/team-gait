"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getLoans,
  approveLoan,
  rejectLoan,
  executeLoan,
  returnLoan,
} from "../services/asset-loan-service";

import {
  AssetLoan,
} from "../types/AssetLoan";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";


interface UseAssetLoansParams {
  search?: string;
  status?: string;
  ownerCompanyId?: number | null;
  borrowerCompanyId?: number | null;
}


export function useAssetLoans(
  params: UseAssetLoansParams = {}
) {

  const {
    search = "",
    status = "ALL",
    ownerCompanyId = null,
    borrowerCompanyId = null,
  } = params;


  const [
    loans,
    setLoans,
  ] = useState<
    AssetLoan[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    currentUserCompanyId,
    setCurrentUserCompanyId,
  ] = useState<number | null>(null);


  const [
    isItAdmin,
    setIsItAdmin,
  ] = useState(false);


  // =========================
  // PAGINATION
  // =========================

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


  const setPageSize = (
    size: number
  ) => {

    setPageSizeState(size);

    setPage(1);

  };


  const nextPage = () => {

    if (
      page < totalPages
    ) {

      setPage(
        (current) =>
          current + 1
      );

    }

  };


  const previousPage = () => {

    if (
      page > 1
    ) {

      setPage(
        (current) =>
          current - 1
      );

    }

  };


  // =========================
  // USER PERMISSION
  // =========================

  async function loadUserPermission() {

    try {

      const supabase =
        createClient();


      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();


      if (!user) {
        return;
      }


      const {
        data: profile,
        error,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq(
            "id",
            user.id
          )
          .single();


      if (error) {
        throw error;
      }


      const role =
        profile?.role;


      if (!role) {
        return;
      }


      if (
        role === "it_admin"
      ) {

        setIsItAdmin(true);

        setCurrentUserCompanyId(
          null
        );

        return;

      }


      setIsItAdmin(false);


      setCurrentUserCompanyId(
        getAdminCompanyId(role)
      );


    } catch (error) {

      console.error(
        "Gagal load user permission:",
        error
      );

    }

  }


  // =========================
  // LOAD LOANS
  // =========================

  async function loadLoans() {

    try {

      console.log(
        "Load Asset Loans..."
      );


      setLoading(true);


      const result =
        await getLoans({

          search,

          status,

          ownerCompanyId,

          borrowerCompanyId,

          page,

          pageSize,

        });


      setLoans(
        result.data ?? []
      );


      setTotal(
        result.total ?? 0
      );


    } catch (error) {

      console.error(
        "Gagal load asset loans:",
        error
      );

      setLoans([]);

      setTotal(0);


    } finally {

      setLoading(false);

    }

  }


  // =========================
  // ACTIONS
  // =========================

  const handleApproveLoan = async (
    loanId: number
  ) => {

    try {

      await approveLoan(
        loanId
      );

      await loadLoans();


    } catch (error) {

      console.error(
        error
      );

      throw error;

    }

  };


  const handleRejectLoan = async (
    loanId: number,
    reason: string
  ) => {

    try {

      await rejectLoan(
        loanId,
        reason
      );

      await loadLoans();


    } catch (error) {

      console.error(
        error
      );

      throw error;

    }

  };


  const handleExecuteLoan =
    async (
      loanId: number
    ) => {

      try {

        await executeLoan(
          loanId
        );

        await loadLoans();


      } catch (error) {

        console.error(
          error
        );

        throw error;

      }

    };


  const handleReturnLoan = async (
    loanId: number
  ) => {

    try {

      await returnLoan(
        loanId
      );

      await loadLoans();


    } catch (error) {

      console.error(
        error
      );

      throw error;

    }

  };


  // =========================
  // EFFECT
  // =========================

  useEffect(() => {

    loadUserPermission();

  }, []);

  useEffect(() => {

  setPage(1);

}, [
  search,
  status,
  ownerCompanyId,
  borrowerCompanyId,
]);

  useEffect(() => {

    loadLoans();

  }, [
    search,
    status,
    ownerCompanyId,
    borrowerCompanyId,
    page,
    pageSize,
  ]);

  

  // =========================
  // RETURN
  // =========================

  return {

    loans,

    loading,

    reload:
      loadLoans,


    approveLoan:
      handleApproveLoan,

    rejectLoan:
      handleRejectLoan,

    executeLoan:
      handleExecuteLoan,

    returnLoan:
      handleReturnLoan,


    currentUserCompanyId,

    isItAdmin,


    // Pagination

    page,

    pageSize,

    total,

    totalPages,

    setPageSize,

    nextPage,

    previousPage,

  };

}