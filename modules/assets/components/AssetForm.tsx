import { AssetFormData } from "../types/AssetFormData";

import { Company } from "../types/masters/Company";
import { Location } from "../types/masters/Location";
import { AssetCategory } from "../types/masters/AssetCategory";
import { AssetModel } from "../types/masters/AssetModel";
import { AssetCondition } from "../types/masters/AssetCondition";
import { AssetStatus } from "../types/masters/AssetStatus";
import { IPManagement }
from "../types/IPManagement";
interface AssetFormProps {

  form: AssetFormData;

  setForm: React.Dispatch<
    React.SetStateAction<AssetFormData>
  >;

  companies: Company[];

  locations: Location[];

  categories: AssetCategory[];

  models: AssetModel[];

  conditions: AssetCondition[];

  statuses: AssetStatus[];

    role: string
}

export default function AssetForm({

  role,

  form,

  setForm,

  companies,

  locations,

  categories,

  models,

  conditions,

  statuses,


}: AssetFormProps) {

const filteredModels =
  models.filter(

    (item) =>

      item.category_id ===
      form.category_id

  );

const selectedModel =
  models.find(
    (m) =>
      m.id === form.model_id
  );

  return (

    <div>

      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >

        Informasi Asset

      </h3>

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <input

          value={form.asset_name}

          onChange={(e) =>
            setForm({
              ...form,
              asset_name:
                e.target.value,
            })
          }

          placeholder="Nama Asset"

          className="
            rounded-xl
            border
            p-3
          "

        />



        <input

          value={form.asset_code}
           
          readOnly

          onChange={(e) =>

            setForm({

              ...form,

              asset_code:
                e.target.value,

            })

          }

          placeholder="Asset Code Generator"

          className="
            rounded-xl
            border
            p-3
          "

        />

      {role === "it_admin" ? (
        <select
          value={form.company_id ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              company_id: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          className="rounded-xl border p-3"
        >
          <option value="">Company</option>

          {companies.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={
            companies.find(
              (item) => item.id === form.company_id
            )?.name ?? "Company belum ditentukan"
          }
          readOnly
          className="rounded-xl border bg-gray-100 p-3"
        />
      )}

        <select

          value={
            form.location_id ?? ""
          }

          onChange={(e) =>
            setForm({
              ...form,
              location_id:
                Number(
                  e.target.value
                ),
            })
          }

          className="
            rounded-xl
            border
            p-3
          "

        >

          <option value="">

            Location

          </option>

          {locations.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >

              {item.name}

            </option>

          ))}

        </select>


        <select
            value={form.category_id ?? ""}

            onChange={(e) =>
              setForm({
                ...form,
               category_id:

              e.target.value

                ? Number(
                    e.target.value
                  )

                : null,
                model_id: null,
              })
            }

            className="
              rounded-xl
              border
              p-3
            "
          >

            <option value="">

              Category

            </option>

            {categories.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >

                {item.name}

              </option>

            ))}

          </select>

          <select

          value={form.model_id ?? ""}

          onChange={(e) =>

            setForm({

              ...form,

              model_id:
                Number(
                  e.target.value
                ),

            })

          }

          className="
            rounded-xl
            border
            p-3
          "

        >

          <option value="">

            Model

          </option>

          {filteredModels.map((item) => (

            <option

              key={item.id}

              value={item.id}

            >

              {item.name}

            </option>

          ))}

        </select>

{/* section 1 selesei */}


      {/* section 2 awal */}
      <div
        className="
          mt-8
          border-t
          pt-6
        "
      >

          <h3
            className="
              mb-4
              text-lg
              font-semibold
            "
          >

            Informasi Teknis

          </h3>

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >

                <input

        value={form.brand}

        onChange={(e)=>

          setForm({

            ...form,

            brand:e.target.value,

          })

        }

        placeholder="Brand"

        className="
          rounded-xl
          border
          p-3
        "

      />

      <input

        value={form.serial_number}

        onChange={(e)=>

          setForm({

            ...form,

            serial_number:
              e.target.value,

          })

        }

        placeholder="Serial Number"

        className="
          rounded-xl
          border
          p-3
        "

      />

      {selectedModel?.spec_source === "manual" && (
        <textarea
          value={form.specification}
          onChange={(e) =>
            setForm({
              ...form,
              specification: e.target.value,
            })
          }
          rows={4}
          placeholder="Specification"
          className="
            md:col-span-2
            rounded-xl
            border
            p-3
          "
        />
      )}

      {selectedModel?.spec_source === "peripheral" && (
        <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="font-medium text-blue-800">
            Spesifikasi melalui Peripheral
          </p>
          <p className="mt-1 text-sm text-blue-700">
            Spesifikasi hardware dan software akan diperoleh
            melalui proses scan pada menu Peripheral.
          </p>
        </div>
      )}

              </div>

      </div>
      {/* section 2 selesei */}



   
{/* IP Management */}




      {/* section 3 selesei */}
    <div
      className="
        mt-8
        border-t
        pt-6
      "
    >

      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >

        Status Asset

      </h3>

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

      <select

          value={form.condition_id ?? ""}

          onChange={(e)=>

            setForm({

              ...form,

              condition_id:

                e.target.value

                  ? Number(
                      e.target.value
                    )

                  : null,

            })

          }

          className="
            rounded-xl
            border
            p-3
          "

        >

          <option value="">

            Condition

          </option>

          {conditions.map((item)=>(

            <option

              key={item.id}

              value={item.id}

            >

              {item.name}

            </option>

          ))}

      </select>

   
<select
  value={form.status_id ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      status_id: e.target.value
        ? Number(e.target.value)
        : null,
    })
  }
  className="rounded-xl border p-3"
>
  <option value="">Status</option>

  {statuses
    .filter(
      (item) =>
        item.name.trim().toLowerCase() !== "loan"
    )
    .map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
</select>

      </div>
  
    </div>
    {/* section 3 akhir */}
    {/* section 4 awal */}
      <div
        className="
          mt-8
          border-t
          pt-6
        "
      >

        <h3
          className="
            mb-4
            text-lg
            font-semibold
          "
        >

          Informasi Pembelian

        </h3>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

<input

  type="date"

  value={form.purchase_date}

  onChange={(e)=>

    setForm({

      ...form,

      purchase_date:
        e.target.value,

    })

  }

  className="
    rounded-xl
    border
    p-3
  "

/>

<input

  type="date"

  value={form.warranty_until}

  onChange={(e)=>

    setForm({

      ...form,

      warranty_until:
        e.target.value,

    })

  }

  className="
    rounded-xl
    border
    p-3
  "

/>

<input

  type="number"

  value={
    form.purchase_price ?? ""
  }

  onChange={(e)=>

    setForm({

      ...form,

      purchase_price:

        e.target.value

          ? Number(
              e.target.value
            )

          : null,

    })

  }

  placeholder="Purchase Price"

  className="
    md:col-span-2
    rounded-xl
    border
    p-3
  "

/>
        
        </div>

      </div>

      {/* section 4 akhir */}
      {/* section 5 awal */}
<div
  className="
    mt-8
    border-t
    pt-6
  "
>

  <h3
    className="
      mb-4
      text-lg
      font-semibold
    "
  >

    Catatan

  </h3>

  <textarea

    value={form.notes}

    onChange={(e)=>

      setForm({

        ...form,

        notes:
          e.target.value,

      })

    }

    rows={5}

    placeholder="
      Tambahkan catatan apabila diperlukan...
    "

    className="
      w-full
      rounded-xl
      border
      p-3
    "

  />

</div>



      </div>

    </div>

    

  );

}