"use client";

import {

  MUTATION_STATUS,

} from "../constants/mutation-status";

interface Props {

  status: string;

}

export default function MutationStatusBadge({

  status,

}: Props) {

  switch (status) {

    case MUTATION_STATUS.PENDING:

      return (

        <span
          className="
            rounded-full
            bg-yellow-100
            px-3
            py-1
            text-xs
            font-semibold
            text-yellow-700
          "
        >

          Pending

        </span>

      );

    case MUTATION_STATUS.APPROVED:

      return (

        <span
          className="
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-xs
            font-semibold
            text-blue-700
          "
        >

          Approved

        </span>

      );

    case MUTATION_STATUS.EXECUTED:

      return (

        <span
          className="
            rounded-full
            bg-green-100
            px-3
            py-1
            text-xs
            font-semibold
            text-green-700
          "
        >

          Executed

        </span>

      );

    case MUTATION_STATUS.REJECTED:

      return (

        <span
          className="
            rounded-full
            bg-red-100
            px-3
            py-1
            text-xs
            font-semibold
            text-red-700
          "
        >

          Rejected

        </span>

      );

    default:

      return (

        <span
          className="
            rounded-full
            bg-gray-100
            px-3
            py-1
            text-xs
            font-semibold
            text-gray-700
          "
        >

          Unknown

        </span>

      );

  }

}