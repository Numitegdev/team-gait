"use client";

import {
useEffect,
useState,
}
from "react";

import {

getTasks,

createTask,

getTaskDetail,

startTask,

completeTask,

}
from "../services/driver-task-service";
import {
  uploadCompletionPhoto,
}
from "../services/upload-photo";

import {
  createClient,
}
from "@/lib/supabase/client";

import {
  cancelTask,
} from "@/modules/driver/driver-task/services/driver-task-service";


export function useDriverTask() {
const [role, setRole] = useState("");

const [


tasks,

setTasks,


] = useState<any[]>([]);

const [


loading,

setLoading,


] = useState(false);

const [


selectedTask,

setSelectedTask,


] = useState<any>(
null
);

const [


openModal,

setOpenModal,


] = useState(false);

useEffect(() => {


loadTasks();
  loadRole();

}, []);

async function loadTasks() {


try {

  setLoading(true);

  const data =
    await getTasks();

  setTasks(
    data || []
  );

} finally {

  setLoading(
    false
  );

}


}

async function getCurrentUserId() {

  const supabase =
    createClient();

  const {
    data,
  } = await supabase.auth.getUser();

  return data.user?.id;

}

async function handleCreate(
  payload: any
) {

  const {

    taskPhoto,

    ...taskData

  } = payload;

  let photoUrl;

  if (taskPhoto) {

    photoUrl =
      await uploadCompletionPhoto(
        taskPhoto
      );

  }

await createTask({

  ...taskData,

  cash_amount:

    ["cash", "transfer"].includes(
      taskData.payment_type
    )

      ? Number(
          taskData.cash_amount || 0
        )

      : null,

  task_photo_url:
    photoUrl,

});

  await loadTasks();

}
async function handleView(
id: number
) {


const detail =
  await getTaskDetail(
    id
  );

setSelectedTask(
  detail
);

setOpenModal(
  true
);


}

async function handleStartTask(
  id: number
) {

  const userId =
    await getCurrentUserId();

  if (!userId)
    return;

  await startTask(
    id,
    userId
  );

  await loadTasks();

}


function closeModal() {


setOpenModal(
  false
);

setSelectedTask(
  null
);


}

async function handleCancel(
  id: number
) {

  if (
    !confirm(
      "Batalkan task ini?"
    )
  ) {
    return;
  }

  await cancelTask(id);

  await loadTasks();

}

async function handleCompleteTask(

  id: number,

  catatan: string,

  file?: File

) {

  let photoUrl =
    undefined;

  if (file) {

    photoUrl =
      await uploadCompletionPhoto(
        file
      );

  }

  await completeTask(

    id,

    catatan,

    photoUrl

  );

  await loadTasks();

}



useEffect(() => {

  loadTasks();

}, []);
useEffect(() => {

  const supabase =
    createClient();

  const channel =
    supabase

      .channel(
        "driver-task-realtime"
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

  (payload) => {

    console.log(
      "REALTIME EVENT",
      payload
    );

    loadTasks();

  }

)

.subscribe(
  (status) => {

    console.log(
      "REALTIME STATUS:",
      status
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


async function loadRole() {
  const supabase = createClient();

  const { data: authData } =
    await supabase.auth.getUser();

  if (!authData.user) return;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  setRole(data?.role || "");
}
return {

  tasks,

  loading,

  selectedTask,

  openModal,

  handleCreate,

  handleView,

  handleStartTask,

  handleCompleteTask,

  handleCancel,

  closeModal,

  refresh:
    loadTasks,

  role,

};

}
