"use client";

import {
  createClient,
}
from "@/lib/supabase/client";

import {
  useEffect,
  useState,
} from "react";

import {

  getChecklistHeaders,

  getChecklistDetails,

  verifyChecklist,

}
from "../services/monitoring-checklist-service";

export function useMonitoringChecklist() {

  const supabase =
  createClient();

  const [

  role,

  setRole,

] = useState("");

const [

  search,

  setSearch,

] = useState(
  ""
);

  const [

    checklistHeaders,

    setChecklistHeaders,

  ] = useState<any[]>([]);

  const [

    loading,

    setLoading,

  ] = useState(
    false
  );

  const [

  selectedChecklist,

  setSelectedChecklist,

] = useState<any>(
  null
);

const [

  checklistDetails,

  setChecklistDetails,

] = useState<any[]>(
  []
);

const [

  openDetail,

  setOpenDetail,

] = useState(
  false
);

useEffect(() => {

  loadData();

  loadRole();

}, []);

const [

  statusFilter,

  setStatusFilter,

] = useState(
  "all"
);


  async function loadData() {

    try {

      setLoading(
        true
      );

      const data =
        await getChecklistHeaders();

      setChecklistHeaders(
        data
      );

    } finally {

      setLoading(
        false
      );

    }

  }

  async function loadRole() {

  const {

    data: { user },

  } =
    await supabase.auth.getUser();

  if (!user)
    return;

  const {

    data,

  } = await supabase

    .from(
      "profiles"
    )

    .select(
      "role"
    )

    .eq(
      "id",
      user.id
    )

    .single();

  setRole(
    data?.role ?? ""
  );

}

  const pendingCount =

    checklistHeaders.filter(

      item =>

        item.status ===
        "pending"

    ).length;

  const verifiedCount =

    checklistHeaders.filter(

      item =>

        item.status ===
        "verified"

    ).length;

  const [

    currentPage,

    setCurrentPage,

  ] = useState(
    1
  );

  const ITEMS_PER_PAGE =
  15;

  const todayCount =

    checklistHeaders.filter(

      item => {

        const today =
          new Date()

            .toISOString()

            .split("T")[0];

        return (

          item.checklist_date ===
          today

        );

      }

    ).length;

   const filteredChecklistHeaders =

  checklistHeaders.filter(
    (item) => {

      const matchStatus =

        statusFilter ===
        "all"

        ||

        item.status ===
        statusFilter;

      const keyword =
        search.toLowerCase();

      const matchSearch =

        item.vehicles
          ?.plat_nomor

          ?.toLowerCase()

          .includes(
            keyword
          )

        ||

        item.vehicles
          ?.nama_kendaraan

          ?.toLowerCase()

          .includes(
            keyword
          )

        ||

        item.profiles
          ?.full_name

          ?.toLowerCase()

          .includes(
            keyword
          );

      return (

        matchStatus

        &&

        matchSearch

      );

    }
  );

  const totalPages =

  Math.ceil(

    filteredChecklistHeaders.length

    /

    ITEMS_PER_PAGE

  );

  const paginatedChecklistHeaders =

  filteredChecklistHeaders.slice(

    (currentPage - 1)

    *

    ITEMS_PER_PAGE,

    currentPage

    *

    ITEMS_PER_PAGE

  );

    async function handleDetail(
    checklist: any
    ) {

    const details =
        await getChecklistDetails(
        checklist.id
        );

    setChecklistDetails(
        details
    );

    setSelectedChecklist(
        checklist
    );

    setOpenDetail(
        true
    );

    console.log(
  details
);

    }


async function handleVerify(
  checklistId: number
) {

  const {

    data: { user },

  } =
    await supabase.auth.getUser();

  if (!user)
    return;

  await verifyChecklist(

    checklistId,

    user.id

  );

  await loadData();

  setOpenDetail(
    false
  );

}

useEffect(() => {

  setCurrentPage(
    1
  );

}, [

  search,

  statusFilter,

]);
  return {

    checklistHeaders,

    loading,

    pendingCount,

    verifiedCount,

    todayCount,

    loadData,

    selectedChecklist,

    checklistDetails,

    openDetail,

    setOpenDetail,

    handleDetail,

    handleVerify,

    role,

    statusFilter,

    setStatusFilter,

    filteredChecklistHeaders,

    search,

    setSearch,

    paginatedChecklistHeaders,

    currentPage,

    setCurrentPage,

    totalPages,

  };

}