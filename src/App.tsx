import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuid } from "uuid";
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card, List } from "./types";
import CardList from "./components/CardList";
import CardItemOverlay from "./components/CardItemOverlay";
import CardListOverlay from "./components/CardListOverlay";
import useCardStore from "./stores/cards";
import useColumnStore from "./stores/columns";
import Add from "./components/Icons/Add";

export default function App() {
	const { columns, setColumns, addNewColumn } = useColumnStore();
	const { cards, setCards } = useCardStore();
	const columnsIds = useMemo(() => columns.map((list) => list.id), [columns]);
	const [selectedColumn, setSelectedColumn] = useState<List | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				distance: 3,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		if (event.active.data.current?.type === "Column") {
			setSelectedColumn(event.active.data.current.column);
			return;
		}
		if (event.active.data.current?.type === "Card") {
			setSelectedCard(event.active.data.current.card);
			return;
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setSelectedColumn(null);
		setSelectedCard(null);

		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;

		if (
			active.data.current?.type !== "Column" ||
			over.data.current?.type !== "Column"
		)
			return;

		const activeColumnIndex = columns.findIndex(
			(column) => column.id === active.id,
		);
		const overColumnIndex = columns.findIndex(
			(column) => column.id === over.id,
		);

		setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;
		const isActiveACard = active.data.current?.type === "Card";
		const isOverACard = over.data.current?.type === "Card";

		if (!isActiveACard) return;

		if (isActiveACard && isOverACard) {
			const activeCardIndex = cards.findIndex(
				(card) => card.id === active.data.current?.card.id,
			);
			const overCardIndex = cards.findIndex(
				(card) => card.id === over.data.current?.card.id,
			);

			cards[activeCardIndex].columnId = cards[overCardIndex].columnId;

			setCards(arrayMove(cards, activeCardIndex, overCardIndex));
		}

		const isOverAColumn = over.data.current?.type === "Column";
		if (isActiveACard && isOverAColumn) {
			const activeCardIndex = cards.findIndex(
				(card) => card.id === active.data.current?.card.id,
			);

			cards[activeCardIndex].columnId = over.data.current?.column.id;

			setCards(arrayMove(cards, activeCardIndex, activeCardIndex));
		}
	};

	const createNewColumn = () => {
		const newColumn: List = {
			id: uuid(),
			title: "New Column",
		};
		addNewColumn(newColumn);
	};

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<main className="bg-neutral-100 min-h-screen w-full">
				<h1 className="text-4xl text-center p-8 font-semibold">Task Board</h1>
				<div className="flex justify-center items-start gap-6">
					<SortableContext
						items={columnsIds}
						strategy={horizontalListSortingStrategy}
					>
						{columns.map((data) => (
							<CardList
								key={data.id}
								data={data}
								cards={cards.filter((card) => card.columnId === data.id)}
							/>
						))}
					</SortableContext>
					<button
						onClick={() => createNewColumn()}
						className="px-8 py-12 text-2xl text-neutral-300 flex items-center justify-center gap-4 border-2 rounded-lg border-dashed border-neutral-300 
					hover:text-neutral-800 hover:border-neutral-800 hover:border-solid hover: bg-neutral-50 transition-all"
					>
						<Add /> Add Column
					</button>
				</div>
			</main>
			{createPortal(
				<DragOverlay>
					{selectedColumn && (
						<CardListOverlay
							data={selectedColumn}
							cards={cards.filter(
								(card) => card.columnId === selectedColumn.id,
							)}
						/>
					)}
					{selectedCard && <CardItemOverlay data={selectedCard} />}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
}
