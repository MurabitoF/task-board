import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip } from "react-tooltip";

import type { Card } from "../types";
import Trash from "./Icons/Trash";
import useCardStore from "../stores/cards";
import ConfirmModal from "./Modals/ConfirmModal";
interface Props {
	data: Card;
}

const CardItem: React.FC<Props> = ({ data }) => {
	const [isMouseOver, setIsMouseOver] = useState(false);
	const [isDeleteCard, setIsDeleteCard] = useState(false);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const { removeCard, showModal, setShowModal, setEditCard } = useCardStore();
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
		disabled: showModal || isDeleteCard,
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
				className="min-h-20 border-2 border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-700 opacity-70"
			></div>
		);
	}

	const isOverflowing = () => {
		if (titleRef.current) {
			return titleRef.current.offsetWidth < titleRef.current.scrollWidth;
		}
		return false;
	};

	const handleOpenModal = () => {
		setEditCard(data);
		setShowModal(true);
	};

	return (
		<li
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={style}
			className="bg-white dark:bg-neutral-900 w-full  p-4 rounded-lg flex flex-col ring-1 ring-neutral-100 dark:ring-neutral-900 border-l-4 border-red-400"
			onClick={handleOpenModal}
			onMouseEnter={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
		>
			<div className="flex justify-between items-center">
				<h3
					ref={titleRef}
					data-tooltip-id={data.id}
					data-tooltip-content={isOverflowing() ? data.title : ""}
					data-tooltip-placement="top"
					data-tooltip-delay-show={800}
					className="text-xl text-ellipsis overflow-x-hidden"
				>
					{data.title}
				</h3>
				<Tooltip id={data.id} />
				{isMouseOver && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							// removeCard(data.id);
							setIsDeleteCard(true);
						}}
						aria-label="delete-card"
						title="delete-card"
						className="stroke-neutral-500 p-[2px] rounded-lg hover:stroke-red-500 hover:bg-neutral-300/30 transition-all z-10"
					>
						<Trash />
					</button>
				)}
			</div>
			<p className="text-sm text-slate-400 self-end">{data.owner}</p>

			<ConfirmModal
				open={isDeleteCard}
				title="Delete Card"
				message="Are you sure you want to delete this card?"
				onAccept={() => removeCard(data.id)}
				onClose={() => setIsDeleteCard(false)}
			/>
		</li>
	);
};

export default CardItem;
