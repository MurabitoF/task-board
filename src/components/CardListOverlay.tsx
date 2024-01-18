import type { Card, List } from "../types";
import CardItemOverlay from "./CardItemOverlay";
import Add from "./Icons/Add";

interface Props {
	data: List;
	cards: Card[];
}

const CardListOverlay: React.FC<Props> = ({ data, cards }) => {
	return (
		<section className="w-[350px] rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-x-hidden flex flex-col shadow-md dark:text-neutral-100">
			<div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950">
				<div className="flex items-center gap-2">
					<p className="text-sm font-semibold text-neutral-100 dark:text-neutral-900 rounded-full w-5 h-5 grid place-content-center bg-neutral-800 dark:bg-neutral-100">
						{cards.length}
					</p>

					<h2 className="font-semibold min-w-36 min-h-3">{data.title}</h2>
				</div>
			</div>
			<ul className="min-h-[112px] flex flex-col flex-grow gap-4 py-4 px-3">
				{cards.map((card) => (
					<CardItemOverlay key={card.id} data={card} />
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
