import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card } from "../types";

interface Props {
	data: Card;
}

const CardItem: React.FC<Props> = ({ data }) => {
	const {
		attributes,
		isDragging,
		listeners,
		transition,
		transform,
		setNodeRef,
	} = useSortable({
		id: data.id,
		data: {
			type: "Card",
			card: data,
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="min-h-20 border-2 border-neutral-300 rounded-lg bg-white opacity-70"
			></div>
		);
	}

	return (
		<li
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={style}
			className="bg-white w-full  p-4 rounded-lg flex flex-col ring-1 ring-neutral-100 border-l-4 border-red-400"
		>
			<h3 className="text-xl text-ellipsis overflow-x-hidden">{data.title}</h3>
			<p className="text-sm text-slate-400 self-end">{data.owner}</p>
		</li>
	);
};

export default CardItem;
