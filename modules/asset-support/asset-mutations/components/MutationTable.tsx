"use client";

import {

  AssetMutation,

} from "../types/AssetMutation";

interface Props {

  mutations: AssetMutation[];

  loading: boolean;

  onView: (id: number) => void;

}
function getStatusBadge(status: string) {

  switch (status) {

    case "PENDING":

      return {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-700",
      };

    case "APPROVED":

      return {
        label: "Approved",
        className:
          "bg-blue-100 text-blue-700",
      };

    case "REJECTED":

      return {
        label: "Rejected",
        className:
          "bg-red-100 text-red-700",
      };

    case "EXECUTED":

      return {
        label: "Executed",
        className:
          "bg-green-100 text-green-700",
      };

    default:

      return {
        label: status,
        className:
          "bg-gray-100 text-gray-600",
      };

  }

}

export default function MutationTable({

  mutations,

  loading,

  onView,

}: Props) {

if (loading) {


  return (

    <div
      className="
        rounded-xl
        border
        bg-white
        p-10
        text-center
      "
    >

      Loading...

    </div>

  );

}

  return (

    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        bg-white
      "
    >     




      <table
        className="
          w-full
        "
      >

        <thead
          className="
            bg-gray-50
            text-center
          "
        >

          <tr>

            <th>No</th>

            <th>Mutation No</th>

            <th>Asset</th>

            <th>From</th>

            <th>To</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

                {mutations.length === 0 ? (

                    <tr>

                    <td

                        colSpan={7}

                        className="
                        py-10
                        text-center
                        text-gray-400
                        "

                    >

                        Belum ada mutation.

                    </td>

                    </tr>

                ) : (

                    mutations.map(

                    (mutation, index) => (

                        <tr
                        key={mutation.id}
                         className="
                          bg-gray-50
                          text-center
                        "

                        >

                        <td>

                            {index + 1}

                        </td>

                       <td
                          className="
                            px-4
                            py-3
                            font-semibold
                            text-blue-600
                          "
                        >

                          {mutation.mutation_no}

                        </td>
                       <td
                          className="
                            px-4
                            py-3
                          "
                        >

                          <div
                            className="
                              font-semibold
                              text-gray-800
                            "
                          >

                            {mutation.asset?.asset_code}

                          </div>

                          <div
                            className="
                              text-sm
                              text-gray-500
                            "
                          >

                            {mutation.asset?.asset_name}

                          </div>

                        </td>

                     <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <div
                          className="
                            font-medium
                            text-gray-800
                          "
                        >

                          {mutation.from_company?.name}

                        </div>

                        <div
                          className="
                            text-sm
                            text-gray-500
                          "
                        >

                          {mutation.from_location?.name}

                        </div>

                      </td>

                       <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <div
                          className="
                            font-medium
                            text-gray-800
                          "
                        >

                          {mutation.to_company?.name}

                        </div>

                        <div
                          className="
                            text-sm
                            text-gray-500
                          "
                        >

                          {mutation.to_location?.name}

                        </div>

                      </td>
                    <td
                      className="
                        px-4
                        py-3
                      "
                    >
                      {(() => {

                        const badge =
                          getStatusBadge(
                            mutation.status
                          );

                        return (

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${badge.className}
                            `}
                          >

                            {badge.label}

                          </span>

                        );

                      })()}
                    </td>

                       <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <button
                         onClick={() =>
                            onView(mutation.id)
                          }
                          className="
                            rounded-lg
                            bg-slate-100
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition
                            hover:bg-slate-200
                          "
                        >

                          View

                        </button>

                      </td>

                        </tr>

                    )

                    )

                )}

        </tbody>

      </table>

    </div>

  );

}