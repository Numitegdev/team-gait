"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getMonitoring,
  verifyTask,
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

  creatorFilter,

  setCreatorFilter,

] = useState("all");

const [
  verifyFilter,
  setVerifyFilter,
] = useState("all");

const [

  profile,

  setProfile,

] = useState<any>(
  null
);


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
  creatorFilter,
  verifyFilter,
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
console.log(data);
      setTasks(data);

    } finally {

      setLoading(false);

    }

  }

  async function initialize() {

  await cleanupDriverPhotos();

  await loadProfile();

  await loadData();

}

async function loadProfile() {

  const supabase =
    createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user)
    return;

  const {
    data,
  } =
    await supabase

      .from("profiles")

      .select("*")

      .eq(
        "id",
        user.id
      )

      .single();

  setProfile(data);

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

  item.driver?.full_name ===
    driverFilter;

const matchCreator =

  creatorFilter === "all"

  ||

  item.creator?.full_name ===
    creatorFilter;
    

const matchVerify =

  verifyFilter === "all"

  ||

  (
    verifyFilter === "verified"
    &&
    item.is_verified === true
  )

  ||

  (
    verifyFilter === "unverified"
    &&
    !item.is_verified
  );
   
return (

  matchSearch &&
  matchStatus &&
  matchDate &&
  matchDriver &&
  matchCreator &&
  matchVerify

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
          item.driver
            ?.full_name
      )

      .filter(Boolean)

  ),

];

const creators = [

  ...new Set(

    tasks

      .map(
        (item) =>
          item.creator?.full_name
      )

      .filter(Boolean)

  ),

];

const canVerify =

  profile?.role ===
    "ga_admin"

  // ||

  // profile?.role ===
  //   "it_admin";


async function handleVerify(
  taskId: number
) {

  try {

    await verifyTask(
      taskId
    );

    await loadData();

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Gagal verifikasi"
    );

  }

}

 
  const filteredStats = {

  total:
    filteredTasks.length,

  pending:
    filteredTasks.filter(
      x => x.status === "pending"
    ).length,

  onProgress:
    filteredTasks.filter(
      x => x.status === "on_progress"
    ).length,

  completed:
    filteredTasks.filter(
      x => x.status === "completed"
    ).length,

};

 return {

  tasks:
    paginatedTasks,

  loading,

  stats: filteredStats,

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

     handleVerify,

  canVerify,

verifyFilter,
  setVerifyFilter,

  creatorFilter,
setCreatorFilter,
creators,

    };

}
