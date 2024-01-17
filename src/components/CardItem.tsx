import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card } from "../types";
import { useState } from "react";
import Trash from "./Icons/Trash";
import useCardStore from "../stores/cards";

interface Props {
	data: Card;
}

const CardItem: React.FC<Props> = ({ data }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isMouseOver, setIsMouseOver] = useState(false);
	const { removeCard } = useCardStore();
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
			onMouseEnter={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
		>
			<div className="flex justify-between items-center">
				<h3 className="text-xl text-ellipsis overflow-x-hidden">
					{data.title}
				</h3>
				{isMouseOver && (
					<button
						onClick={() => removeCard(data.id)}
						aria-label="delete-card"
						title="delete-card"
						className="stroke-neutral-500 hover:stroke-red-500 transition-all"
					>
						<Trash />
					</button>
				)}
			</div>
			<p className="text-sm text-slate-400 self-end">{data.owner}</p>
		</li>
	);
};

export default CardItem;
