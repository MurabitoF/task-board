import { useMemo, useState } from "react";

import type { Card, List } from "../types";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import CardItem from "./CardItem";
import Add from "./Icons/Add";

interface Props {
	data: List;
	cards: Card[];
	updateColumn: (id: string, title: string) => void;
}

const CardList: React.FC<Props> = ({ data, cards, updateColumn }) => {
	const [isEditing, setIsEditing] = useState(false);
	const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);
	const {
		attributes,
		isDragging,
		listeners,
		node,
		transition,
		transform,
		setNodeRef,
	} = useSortable({
		id: data.id,
		data: {
			type: "Column",
			column: data,
		},
		disabled: isEditing,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		height: isDragging ? node.current?.offsetHeight : "auto",
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="w-[350px] flex flex-col gap-4 border-2 border-neutral-50 rounded-lg bg-neutral-500 opacity-20"
			></div>
		);
	}

	return (
		<section
			ref={setNodeRef}
			style={style}
			className="w-[350px] max-h-[800px] rounded-lg bg-neutral-200 overflow-x-hidden overflow-y-auto flex flex-col"
		>
			<div
				{...attributes}
				{...listeners}
				className="flex items-center justify-between p-4 bg-neutral-100"
			>
				<div className="flex items-center gap-2">
					<p className=" text-sm font-semibold text-neutral-100 rounded-full w-5 h-5 grid place-content-center bg-neutral-800">
						{cards.length}
					</p>
					{!isEditing && (
						<h2
							className="font-semibold min-w-36 min-h-3"
							onClick={() => setIsEditing(true)}
						>
							{data.title}
						</h2>
					)}
					{isEditing && (
						<input
							className=""
							type="text"
							value={data.title}
							autoFocus
							onChange={(e) => {
								updateColumn(data.id, e.target.value);
							}}
							onBlur={() => setIsEditing(false)}
						/>
					)}
				</div>
				<button>Delete</button>
			</div>
			<ul className="min-h-[112px] flex flex-col flex-grow gap-4 py-4 px-3">
				<SortableContext
					id={data.id}
					items={cardsIds}
					strategy={verticalListSortingStrategy}
				>
					{cards.map((card) => (
						<CardItem key={card.id} data={card} />
					))}
				</SortableContext>
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

export default CardList;
