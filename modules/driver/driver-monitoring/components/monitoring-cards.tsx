interface Props {

stats: {


total: number;

pending: number;

onProgress: number;

completed: number;


};

}

export function MonitoringCards({

stats,

}: Props) {

const cards = [


{
  title: "Total Task",
  value: stats.total,
},

{
  title: "Pending",
  value: stats.pending,
},

{
  title: "On Progress",
  value: stats.onProgress,
},

{
  title: "Completed",
  value: stats.completed,
},


];

return (


<div
  className="
    grid
    gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
>

  {

    cards.map(
      (card) => (

        <div

          key={card.title}

          className="
            rounded-xl
            border
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
          "

        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            {card.title}

          </div>

          <div
            className="
              mt-2
              text-3xl
              font-bold
            "
          >

            {card.value}

          </div>

        </div>

      )
    )

  }

</div>


);

}
