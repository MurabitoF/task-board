import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card, List } from "../types";
import CardItem from "./CardItem";
import Add from "./Icons/Add";
import useCardStore from "../stores/cards";
import useColumnStore from "../stores/columns";
import Trash from "./Icons/Trash";

interface Props {
	data: List;
	cards: Card[];
}

const CardList: React.FC<Props> = ({ data, cards }) => {
	const { addNewCard } = useCardStore();
	const { updateColumn, removeColumn } = useColumnStore();
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

	const createNewCard = (listId: string) => {
		const newCard: Card = {
			id: uuid(),
			title: "New Card",
			description: "Description",
			owner: "Franco",
			columnId: listId,
		};
		addNewCard(newCard);
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="w-[350px] flex flex-col gap-4 border-2 border-neutral-50 rounded-lg bg-neutral-300 opacity-20"
			></div>
		);
	}

	return (
		<section
			ref={setNodeRef}
			style={style}
			className="w-[350px] rounded-lg bg-neutral-50 overflow-x-hidden flex flex-col shadow-md"
		>
			<div
				{...attributes}
				{...listeners}
				className="flex items-center justify-between p-4 bg-white"
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
				<button
					onClick={() => removeColumn(data.id)}
					className="rounded-lg p-1 stroke-neutral-500 hover:stroke-white hover:bg-red-500 transition-all"
				>
					<Trash />
				</button>
			</div>
			<ul className="min-h-[112px] max-h-[600px] flex flex-col flex-grow gap-4 py-4 px-3 overflow-y-auto">
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
				<button
					onClick={() => createNewCard(data.id)}
					className="w-full h-10 flex items-center gap-2 px-4 font-semibold text-white hover:outline-none"
				>
					<Add />
					Add Card
				</button>
			</div>
		</section>
	);
};

export default CardList;
