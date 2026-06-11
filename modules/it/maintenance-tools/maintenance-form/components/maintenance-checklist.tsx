interface Props {

  form: any;

  setForm: any;

}

export function MaintenanceChecklist({

  form,

  setForm,

}: Props) {

  const checklistItems = [

    {
      label: "Mouse",
      field: "keyboard_mouse",
      options: [
        "aman",
        "trouble",
      ],
    },

    {
      label: "RAM",
      field: "ram",
      options: [
        "aman",
        "trouble",
      ],
    },

    {
      label: "Power Supply",
      field: "power_supply",
      options: [
        "aman",
        "trouble",
      ],
    },

    {
      label: "Motherboard",
      field: "motherboard",
      options: [
        "aman",
        "trouble",
      ],
    },

    {
      label: "Hardisk",
      field: "hardisk",
      options: [
        "aman",
        "trouble",
      ],
    },

    {
      label: "Baut / Mur",
      field: "baut",
      options: [
        "Lengkap",
        "Kurang",
      ],
    },

    {
      label: "CCleaner",
      field: "cleaner",
      options: [
        "Ya",
        "Tidak",
      ],
    },

  ];

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
      "
    >

      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >
        Checklist Maintenance
      </h3>

      <div
        className="
          overflow-x-auto
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

              <th
                className="
                  p-3
                  text-left
                "
              >
                Komponen
              </th>

              <th
                className="
                  p-3
                  text-left
                "
              >
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {checklistItems.map(
              (item) => (

                <tr
                  key={item.field}
                  className="
                    border-b
                  "
                >

                  <td
                    className="
                      p-3
                    "
                  >
                    {item.label}
                  </td>

                  <td
                    className="
                      p-3
                    "
                  >

                    <select

                      value={
                        form[
                          item.field
                        ]
                      }

                      onChange={(e) =>
                        setForm({
                          ...form,

                          [item.field]:
                            e.target.value,
                        })
                      }

                      className="
                        w-full
                        rounded-lg
                        border
                        p-2
                      "
                    >

                      {item.options.map(
                        (
                          option
                        ) => (

                          <option
                            key={
                              option
                            }
                            value={
                              option
                            }
                          >

                            {option}

                          </option>

                        )
                      )}

                    </select>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}