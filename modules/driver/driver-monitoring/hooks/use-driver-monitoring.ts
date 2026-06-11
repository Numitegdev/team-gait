"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getMonitoring,
}
from "../services/driver-monitoring-service";

import {
  createClient,
}
from "@/lib/supabase/client";

import {
  cleanupDriverPhotos,
}
from "../../driver-task/services/cleanup-service";

export function useDriverMonitoring() {

    const [

  search,

  setSearch,

] = useState("");

  const [

    tasks,

    setTasks,

  ] = useState<any[]>(
    []
  );

  const [

    loading,

    setLoading,

  ] = useState(
    false
  );

const [

  statusFilter,

  setStatusFilter,

] = useState(
  "all"
);

const [

  driverFilter,

  setDriverFilter,

] = useState("all");



const [

  page,

  setPage,

] = useState(
  1
);
const [

  dateFrom,

  setDateFrom,

] = useState("");

const [

  dateTo,

  setDateTo,

] = useState("");

  useEffect(() => {

  initialize();

}, []);

  
useEffect(() => {

  setPage(1);

}, [

  search,

  statusFilter,

  driverFilter,

  dateFrom,

  dateTo,

]);


useEffect(() => {

  const supabase =
    createClient();

  const channel =
    supabase

      .channel(
        "driver-monitoring-realtime"
        )

      .on(

        "postgres_changes",

        {

          event: "*",

          schema:
            "public",

          table:
            "driver_tasks",

        },

       () => {

        loadData();

        }

      )

     .subscribe(
  (status, err) => {

    console.log(
      "REALTIME STATUS:",
      status
    );

    console.log(
      "REALTIME ERROR:",
      err
    );

  }
);

  return () => {

    supabase

      .removeChannel(
        channel
      );

  };

}, []);

  async function loadData() {

    try {

      setLoading(true);

      const data =
        await getMonitoring();

      setTasks(data);

    } finally {

      setLoading(false);

    }

  }

  async function initialize() {

  await cleanupDriverPhotos();

  await loadData();

}

    const [

    selectedTask,

    setSelectedTask,

    ] = useState<any>(
    null
    );

    async function handleView(
  task: any
) {

  setSelectedTask(
    task
  );

}

  const stats = {

    total:
      tasks.length,

    pending:
      tasks.filter(
        (x) =>
          x.status ===
          "pending"
      ).length,

    onProgress:
      tasks.filter(
        (x) =>
          x.status ===
          "on_progress"
      ).length,

    completed:
      tasks.filter(
        (x) =>
          x.status ===
          "completed"
      ).length,

  };


  const filteredTasks =
  tasks.filter(
    (item) => {
 const taskDate =
  item.created_at
    ?.split("T")[0];

const matchDate =

  (!dateFrom ||
    taskDate >=
      dateFrom)

  &&

  (!dateTo ||
    taskDate <=
      dateTo);
      const keyword =
        search.toLowerCase();

      const matchSearch =

        item.nomor_task
          ?.toLowerCase()
          .includes(
            keyword
          )

        ||

        item.pengirim
          ?.toLowerCase()
          .includes(
            keyword
          )

        ||

        item.penerima
          ?.toLowerCase()
          .includes(
            keyword
          );

   const matchStatus =

  statusFilter ===
    "all"

  ||

  item.status ===
    statusFilter;

const matchDriver =

  driverFilter ===
    "all"

  ||

  item.profiles
    ?.full_name ===
    driverFilter;

      return (
         matchSearch && matchStatus &&
           matchDate  && matchDriver
      );

     

    }
  );

 const PAGE_SIZE =
  10;
const totalPages =
  Math.ceil(
    filteredTasks.length /
    PAGE_SIZE
  ); 
const paginatedTasks =
  filteredTasks.slice(

    (page - 1)
    *
    PAGE_SIZE,

    page
    *
    PAGE_SIZE

  );

  const drivers = [

  ...new Set(

    tasks

      .map(
        (item) =>
          item.profiles
            ?.full_name
      )

      .filter(Boolean)

  ),

];
 return {

  tasks:
    paginatedTasks,

  loading,

  stats,

  search,

  setSearch,

  statusFilter,

  driverFilter,

  setDriverFilter,

drivers,

    setStatusFilter,
    
    page,

    setPage,
    
    selectedTask,

    setSelectedTask,

    handleView,

    totalPages,
    dateFrom,
    setDateFrom,

    dateTo,
    setDateTo,

    };

}