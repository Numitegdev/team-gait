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
export function useDriverTask() {

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
return {

  tasks,

  loading,

  selectedTask,

  openModal,

  handleCreate,

  handleView,

  handleStartTask,

  handleCompleteTask,
  
  closeModal,

  refresh:
    loadTasks,

};

}
