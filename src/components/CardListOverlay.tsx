import type { Card, List } from "../types";
import CardItem from "./CardItem";
import Add from "./Icons/Add";

interface Props {
	data: List;
	cards: Card[];
}

const CardListOverlay: React.FC<Props> = ({ data, cards }) => {
	return (
		<section className="w-[350px] max-h-[800px] rounded-lg bg-neutral-50 overflow-x-hidden overflow-y-auto flex flex-col">
			<div className="flex items-center justify-between p-4 bg-white">
				<div className="flex items-center gap-2">
					<p className=" text-sm font-semibold text-neutral-100 rounded-full w-5 h-5 grid place-content-center bg-neutral-800">
						{cards.length}
					</p>

					<h2 className="font-semibold min-w-36 min-h-3">{data.title}</h2>
				</div>
				<button>Delete</button>
			</div>
			<ul className="min-h-[112px] flex flex-col flex-grow gap-4 py-4 px-3">
				{cards.map((card) => (
					<CardItem key={card.id} data={card} />
				))}
			</ul>
			<div className="bg-indigo-500 rounded-b-lg hover:opacity-90">
				<button className="w-full h-10 flex items-center gap-2 px-4 font-semibold text-white">
					<Add />
					Add Card
				</button>
			</div>
		</section>
	);
};

export default CardListOverlay;
