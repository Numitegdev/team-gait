"use client";

import {
  useRef,
  useState,
} from "react";

import { toJpeg }
from "html-to-image";

import { useMaintenanceSchedule }
from "./hooks/use-maintenance-schedule";

import { ScheduleCalendar }
from "./components/schedule-calendar";

import { ScheduleModal }
from "./components/schedule-modal";

import { MaintenanceSchedule }
from "./types/maintenance-schedule";

export default function MaintenanceSchedulePage() {

  const {

    schedules,

    addSchedule,

    editSchedule,

    removeSchedule,

  } = useMaintenanceSchedule();

 const calendarRef =
  useRef<HTMLDivElement>(
    null
  );

  const [
  openModal,
  setOpenModal,
] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [
    editingSchedule,
    setEditingSchedule,
  ] =
    useState<MaintenanceSchedule | null>(
      null
    );

function handleDateClick(
  date: string
) {

  const existingSchedule =
    schedules.find(
      (item) =>
        item.tanggal === date
    );

  if (
    existingSchedule
  ) {

    setEditingSchedule(
      existingSchedule
    );

  } else {

    setEditingSchedule(
      null
    );

  }

  setSelectedDate(
    date
  );

  setOpenModal(
    true
  );

}

  async function handleSave(
    payload: any
  ) {

    if (editingSchedule) {

      await editSchedule(
        editingSchedule.id,
        payload
      );

    } else {

      await addSchedule(
        payload
      );

    }

  }

async function exportJPG() {

  if (!calendarRef.current)
    return;

  const dataUrl =
    await toJpeg(
      calendarRef.current,
      {
        quality: 1,
      }
    );

  const link =
    document.createElement(
      "a"
    );

  link.download =
    `maintenance-schedule.jpg`;

  link.href =
    dataUrl;

  link.click();

}

  return (

    <div
      className="
        space-y-6
      "
    >

    <div
        className="
            flex
            items-center
            justify-between
            gap-4
        "
        >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Maintenance Schedule
          </h1>

          <p
            className="
              text-slate-500
            "
          >
            Jadwal maintenance dan hari libur
          </p>

        </div>

      </div>

<button

  onClick={exportJPG}

  className="
    rounded-xl
    bg-green-600
    px-4
    py-2
    text-white
  "
>

  Export JPG

</button>

     <ScheduleCalendar

        ref={calendarRef}

        schedules={
            schedules
        }

        onDateClick={
            handleDateClick
        }

        />

      <ScheduleModal

            open={openModal}

            onClose={() =>
                setOpenModal(false)
            }

            onSave={handleSave}

            onDelete={
            removeSchedule
            }

            selectedDate={
                selectedDate
            }

            editingSchedule={
                editingSchedule
            }

            />

    </div>

  );

}