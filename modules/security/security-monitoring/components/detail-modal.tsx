"use client";
import { createClient }
from "@/lib/supabase/client";
interface Props {

  open: boolean;

  onClose: () => void;

  data: any;

  role: string;

  onVerify: (
    id: number
  ) => void;

}
const supabase =
  createClient();

function getPhotoUrl(
  fileName: string
) {

  if (!fileName)
    return "";

  const { data } =
    supabase.storage

      .from(
        "security_photos"
      )

      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

}
export function DetailModal({

  open,

  onClose,

  data,

  role,

  onVerify,

}: Props) {

  if (
    !open ||
    !data
  )
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "
    >

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-5xl
          overflow-y-auto
          rounded-2xl
          bg-white
          p-6
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-2xl
              font-bold
            "
          >

            Detail Monitoring

          </h2>

          <button

            onClick={
              onClose
            }

            className="
              rounded-lg
              border
              px-3
              py-2
            "
          >

            Close

          </button>

        </div>

        <div
          className="
            mb-6
            grid
            gap-4
            md:grid-cols-2
          "
        >

          <div>

            <strong>
              Tanggal :
            </strong>

            <div>
              {
                data.tanggal
              }
            </div>

          </div>

          <div>

            <strong>
              Petugas :
            </strong>

            <div>
              {
                data.petugas
              }
            </div>

          </div>

          <div>

            <strong>
              Shift :
            </strong>

            <div>
              {
                data.shift
              }
            </div>

          </div>

          <div>

            <strong>
              Catatan :
            </strong>

            <div>
              {
                data.catatan
              }
            </div>

            <div>

              <strong>
                Verifikasi :
              </strong>

              <div>

                {data.is_verified
                  ? "Verified"
                  : "Not Verified"}

              </div>

            </div>


          </div>

        </div>

        <div
          className="
            space-y-4
          "
        >

          {data.details?.map(

            (
              item: any
            ) => (

              <div

                key={
                  item.id
                }

                className="
                  rounded-xl
                  border
                  p-4
                "
              >

                <h3
                  className="
                    mb-4
                    text-lg
                    font-semibold
                  "
                >

                  {
                    item.nama_lokasi
                  }

                </h3>

                <div
                  className="
                    grid
                    gap-4
                    md:grid-cols-3
                  "
                >

                  <div>

                    {item.foto_url ?
                     (

                   <div
                      className="
                        space-y-2
                      "
                    >

                      <img
                        src={item.foto_url}
                        alt=""
                        className="
                          h-48
                          w-full
                          rounded-xl
                          object-cover
                        "
                      />

                      <a
                        href={item.foto_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="
                          inline-block
                          rounded-lg
                          bg-green-600
                          px-3
                          py-2
                          text-white
                        "
                      >

                        Download Foto

                      </a>

                    </div>

                    ) : (

                      <div
                        className="
                          flex
                          h-48
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-100
                        "
                      >

                        Tidak ada foto

                      </div>

                    )}

                  </div>

                  <div>

                    <strong>
                      Status
                    </strong>

                    <div>

                      {
                        item.status
                      }

                    </div>

                  </div>

                  <div>

                    <strong>
                      Catatan
                    </strong>

                    <div>

                      {
                        item.catatan
                      }

                    </div>

                  </div>

                </div>

              </div>

            )

          )}


        <div
          className="
            mt-6
            flex
            justify-end
            gap-2
          "
        >

          {role === "ga_admin" &&
          !data.is_verified && (

            <button

              onClick={() =>
                onVerify(data.id)
              }

             className="
                mt-6
                w-full
                rounded-lg
                bg-green-600
                py-3
                text-white
              "
            >

              Verify

            </button>

          )}

        </div>


        </div>

      </div>

    </div>

  );

}