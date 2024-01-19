import { useMemo, useState } from "react";
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
import ConfirmModal from "./Modals/ConfirmModal";
import { motion } from "framer-motion";

interface Props {
	data: List;
	cards: Card[];
}

const CardList: React.FC<Props> = ({ data, cards }) => {
	const { setSelectedListId, setShowModal, removeCardsFromColumn } =
		useCardStore();
	const { updateColumn, removeColumn } = useColumnStore();
	const [isEditing, setIsEditing] = useState(false);
	const [isColumnDelete, setIsColumnDelete] = useState(false);
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
		disabled: isEditing || isColumnDelete,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		height: isDragging ? node.current?.offsetHeight : "auto",
	};

	const handleOpenModal = () => {
		setShowModal(true);
		setSelectedListId(data.id);
	};

	const handleDeleteColumn = () => {
		removeColumn(data.id);
		removeCardsFromColumn(data.id);
	};

	if (isDragging) {
		return (
			<motion.div
				ref={setNodeRef}
				style={style}
				className="w-[350px] flex flex-col gap-4 border-2 border-neutral-50 rounded-lg bg-neutral-300 opacity-20 first:ml-auto"
			></motion.div>
		);
	}

	return (
		<section ref={setNodeRef} style={style} className="first:ml-auto ">
			<motion.section
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0, style }}
				className="w-[350px] rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-x-hidden flex-shrink-0 flex flex-col shadow-md"
			>
				<div
					{...attributes}
					{...listeners}
					className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950"
				>
					<div className="flex items-center gap-2">
						<p className="text-sm font-semibold text-neutral-100 dark:text-neutral-900 rounded-full w-5 h-5 grid place-content-center bg-neutral-800 dark:bg-neutral-100">
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
								className="focus:outline-indigo-500 focus:shadow-none dark:bg-black"
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
						onClick={() => setIsColumnDelete(true)}
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
				<div className="bg-indigo-600 rounded-b-lg hover:opacity-90">
					<button
						onClick={handleOpenModal}
						className="w-full h-10 flex items-center gap-2 px-4 font-semibold text-white focus:outline-none"
					>
						<Add />
						Add Card
					</button>
				</div>
				{isColumnDelete && (
					<ConfirmModal
						open={isColumnDelete}
						title="Delete Column"
						message="Are you sure you want to delete this column? All the tasks will be lost."
						onAccept={handleDeleteColumn}
						onClose={() => setIsColumnDelete(false)}
					/>
				)}
			</motion.section>
		</section>
	);
};

export default CardList;
