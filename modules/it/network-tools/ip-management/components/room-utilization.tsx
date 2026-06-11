"use client";

import { Device }
from "../types/ip-management";

import { IP_POOLS }
from "../constants/ip-pools";

interface Props {
  devices: Device[];
}

export function RoomUtilization({
  devices,
}: Props) {

  function getTotalIP(
    start: string,
    end: string
  ) {

    const startNum =
      Number(
        start.split(".")[3]
      );

    const endNum =
      Number(
        end.split(".")[3]
      );

    return (
      endNum -
      startNum +
      1
    );
  }

  const rooms = Object.entries(
    IP_POOLS["Network Office"]
  );

  return (

    <div
      className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-3
      "
    >

      {rooms.map(
        ([room, range]) => {

          const used =
            devices.filter(
              (item) =>
                item.ruangan === room
            ).length;

          const total =
            getTotalIP(
              range[0],
              range[1]
            );

          const percent =
            Math.round(
              (used / total) *
              100
            );

          return (

            <div
              key={room}
              className="
                rounded-2xl
                border
                bg-white
                p-4
              "
            >

              <h3
                className="
                  font-bold
                "
              >
                {room}
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {used} / {total} IP Used
              </p>

              <div
                className="
                  mt-3
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-slate-200
                "
              >

                <div
                  className="
                    h-full
                    bg-green-500
                  "
                  style={{
                    width:
                      `${percent}%`,
                  }}
                />

              </div>

             <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-between
                "
                >

                <p
                    className="
                    text-sm
                    font-semibold
                    "
                >
                    {percent}%
                </p>

                <span
                    className={`
                    text-xs
                    font-semibold

                    ${
                        percent >= 100
                        ? "text-red-600"
                        : percent >= 80
                        ? "text-yellow-600"
                        : "text-green-600"
                    }
                    `}
                >

                    {
                    percent >= 100
                        ? "🔴 Full"
                        : percent >= 80
                        ? "🟡 Almost Full"
                        : "🟢 Available"
                    }

                </span>

                </div>

            </div>

          );
        }
      )}

    </div>

  );
}