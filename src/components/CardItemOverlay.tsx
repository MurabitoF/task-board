import type { Card } from "../types";

interface Props {
	data: Card;
}

const CardItemOverlay: React.FC<Props> = ({ data }) => {
	return (
		<li className="bg-white w-full  p-4 rounded-lg flex flex-col ring-1 ring-neutral-100 border-l-4 border-red-400">
			<h3 className="text-xl text-ellipsis overflow-x-hidden">{data.title}</h3>
			<p className="text-sm text-slate-400 self-end">{data.owner}</p>
		</li>
	);
};

export default CardItemOverlay;
