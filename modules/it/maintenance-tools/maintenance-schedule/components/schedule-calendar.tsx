"use client";

import {
  useState,
  useEffect,
  forwardRef,
} from "react";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";

import { MaintenanceSchedule }
from "../types/maintenance-schedule";

interface Props {

  schedules:
    MaintenanceSchedule[];

  onDateClick: (
    date: string
  ) => void;

}

export const ScheduleCalendar =
forwardRef<
  HTMLDivElement,
  Props
>(function ScheduleCalendar({

  schedules,

  onDateClick,

}: Props, ref) {

  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date()
  );

  const [
    isMobile,
    setIsMobile,
  ] = useState(false);

  useEffect(() => {

    function handleResize() {

      setIsMobile(
        window.innerWidth < 768
      );

    }

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  const monthStart =
    startOfMonth(
      currentDate
    );

  const monthEnd =
    endOfMonth(
      currentDate
    );

  const days =
    eachDayOfInterval({

      start:
        monthStart,

      end:
        monthEnd,

    });

  const firstDay =
    getDay(monthStart);

  const emptyCells =
    Array(firstDay)
      .fill(null);

  return (

    <div

      ref={ref}

      className="
        rounded-2xl
        border
        bg-white
        p-4
        md:p-6
      "
    >

      {/* HEADER */}

      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >

        <button

          onClick={() =>
            setCurrentDate(
              subMonths(
                currentDate,
                1
              )
            )
          }

          className="
            rounded-lg
            border
            px-3
            py-2
            hover:bg-slate-50
          "
        >

          ◀

        </button>

        <h2
          className="
            text-lg
            md:text-2xl
            font-bold
          "
        >

          {format(
            currentDate,
            "MMMM yyyy"
          )}

        </h2>

        <button

          onClick={() =>
            setCurrentDate(
              addMonths(
                currentDate,
                1
              )
            )
          }

          className="
            rounded-lg
            border
            px-3
            py-2
            hover:bg-slate-50
          "
        >

          ▶

        </button>

      </div>

      {/* WEEK HEADER */}

      <div
        className="
          mb-2
          grid
          grid-cols-7
          gap-1
          md:gap-2

          text-center

          text-[10px]
          md:text-sm

          font-semibold
        "
      >

        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>

      </div>

      {/* CALENDAR */}

      <div
        className="
          grid
          grid-cols-7
          gap-1
          md:gap-2
        "
      >

        {emptyCells.map(
          (_, index) => (

            <div
              key={`empty-${index}`}
            />

          )
        )}

        {days.map((day) => {

          const dateString =
            format(
              day,
              "yyyy-MM-dd"
            );

          const daySchedules =
            schedules.filter(
              (item) =>
                item.tanggal ===
                dateString
            );

          const dayColor =
            daySchedules.length > 0
              ? daySchedules[0].warna
              : "";

          return (

            <div

              key={dateString}

              onClick={() =>
                onDateClick(
                  dateString
                )
              }

              className="
                min-h-[80px]
                md:min-h-[120px]

                cursor-pointer

                rounded-xl
                border

                p-1
                md:p-2

                transition

                hover:scale-[1.02]
              "

              style={{
                backgroundColor:
                  dayColor || "white",
              }}
            >

              <div
                className={`
                  mb-1

                  text-xs
                  md:text-sm

                  font-semibold

                  ${
                    dayColor
                      ? "text-white"
                      : "text-black"
                  }
                `}
              >

                {format(
                  day,
                  "d"
                )}

              </div>

              <div
                className="
                  space-y-1
                "
              >

                {daySchedules
                  .slice(
                    0,
                    isMobile
                      ? 1
                      : 3
                  )
                  .map(
                    (
                      schedule
                    ) => (

                      <div

                        key={
                          schedule.id
                        }

                        className={`
                          truncate

                          rounded-md

                          px-1
                          py-1

                          text-[10px]
                          md:text-xs

                          ${
                            dayColor
                              ? "text-white"
                              : "text-slate-700"
                          }
                        `}
                      >

                        {
                          schedule.ruangan
                        }

                      </div>

                    )
                  )}

                {daySchedules.length >
                  (
                    isMobile
                      ? 1
                      : 3
                  ) && (

                  <div
                    className={`
                      text-[10px]
                      md:text-xs

                      font-medium

                      ${
                        dayColor
                          ? "text-white"
                          : "text-slate-500"
                      }
                    `}
                  >

                    +

                    {
                      daySchedules.length -
                      (
                        isMobile
                          ? 1
                          : 3
                      )
                    }

                    {" "}
                    more

                  </div>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

});