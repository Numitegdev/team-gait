"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  cleanupOldPhotos,
}
from "../services/cleanup-service";
import {
  exportSecurityPdf,
}
from "../utils/export-pdf";

import {

  getChecks,

  getCheckDetail,

  deleteCheck,

    verifyCheck,
}
from "../services/security-monitoring-service";


export function useSecurityMonitoring() {

  const [

    checks,

    setChecks,

  ] = useState<any[]>([]);

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    openModal,

    setOpenModal,

  ] = useState(false);

  const [

    selectedData,

    setSelectedData,

  ] = useState<any>(
    null
  );

useEffect(() => {

  initialize();

}, []);

async function initialize() {

  await cleanupOldPhotos();

  await loadChecks();

}

  async function loadChecks() {

    try {

      setLoading(true);

      const data =
        await getChecks();

      setChecks(
        data || []
      );

    } finally {

      setLoading(
        false
      );

    }

  }

  async function handleView(
    id: number
  ) {

    try {

      setLoading(true);

     const detail =
  await getCheckDetail(
    id
  );


      setSelectedData(
        detail
      );

      setOpenModal(
        true
      );

    } finally {

      setLoading(
        false
      );

    }

  }

async function handleVerify(
  id: number
) {

  try {

    setLoading(true);

    await verifyCheck(id);

    setOpenModal(false);

    setSelectedData(null);

    await loadChecks();

  } finally {

    setLoading(false);

  }

}
  async function handleDelete(
  id: number
) {

  const confirmDelete =
    window.confirm(
      "Hapus data monitoring ini?"
    );

  if (!confirmDelete)
    return;

  try {

    setLoading(true);

    await deleteCheck(id);

    await loadChecks();

  } finally {

    setLoading(false);

  }

}
  function closeModal() {

    setOpenModal(
      false
    );

    setSelectedData(
      null
    );

  }


  
  return {

  checks,

  loading,

  refresh:
    loadChecks,

  openModal,

  selectedData,

  handleView,

  handleDelete,

  handleExportPdf,

   handleVerify,

  closeModal,

};
async function handleExportPdf(
  id: number
) {

  try {

    setLoading(true);

    const detail =
      await getCheckDetail(
        id
      );

    await exportSecurityPdf(
      detail
    );

  } finally {

    setLoading(false);

  }

}



}
