"use client";

import { Device }
from "../types/ip-management";
import { getRoomName } from "../constants/room-options";
interface Props {

  devices: Device[];

  page: number;

  setPage: (
    page: number
  ) => void;

  totalPages: number;

  onEdit: (
    device: Device
  ) => void;

  onDelete: (
    id: number
  ) => void;
}

export function IPManagementTable({

  devices,

  page,
  setPage,
  totalPages,

  onEdit,
  onDelete,
  

}: Props) {

  return (

    <div
      className="
        overflow-x-auto
        rounded-2xl
        border
      "
    >

      <table
        className="
          w-full
          text-sm
        "
      >

        <thead>

          <tr
            className="
              border-b
              bg-slate-50
            "
          >

            <th className="p-3 text-left">
              Device
            </th>
            <th className="p-3 text-left">
              Keterangan
            </th>


            <th className="p-3 text-left">
              IP Address
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Ruangan
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Network
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Fungsional
            </th>

             <th className="p-3 text-left hidden md:table-cell">
              ISP Utama
            </th>

               <th className="p-3 text-left hidden md:table-cell">
              ISP Backup
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {devices.map((item) => (

            <tr
              key={item.id}
              className="border-b"
            >

              <td className="p-3">
                {item.device}
              </td>
               <td className="p-3">
                {item.keterangan}
              </td>

              <td className="p-3">
                {item.ip_terkini}
              </td>

              <td className="p-3 hidden md:table-cell">
               {getRoomName(item.ruangan)}
              </td>

              <td className="p-3 hidden md:table-cell">
                {item.jenis_network}
              </td>

              <td className="p-3 hidden md:table-cell">
                {item.fungsional}
              </td>

              <td className="p-3">
                {item.isp_utama || "-"}</td>

              <td className="p-3">
                {item.isp_backup || "-"}</td>

              <td className="p-3 hidden md:table-cell">

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      onEdit(item)
                    }
                    className="
                      rounded-lg
                      bg-blue-600
                      px-3
                      py-1
                      text-white
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item.id)
                    }
                    className="
                      rounded-lg
                      bg-red-600
                      px-3
                      py-1
                      text-white
                    "
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

            <div
        className="
            border-t
            p-4
            flex
            items-center
            justify-center
            gap-4
        "
        >

        <button
            disabled={page === 1}
            onClick={() =>
            setPage(page - 1)
            }
            className="
            rounded-lg
            border
            px-3
            py-1
            disabled:opacity-50
            "
        >
            Prev
        </button>

        <span>
            Page {page} / {totalPages}
        </span>

        <button
            disabled={
            page === totalPages
            }
            onClick={() =>
            setPage(page + 1)
            }
            className="
            rounded-lg
            border
            px-3
            py-1
            disabled:opacity-50
            "
        >
            Next
        </button>

        </div>

    </div>





  );
}