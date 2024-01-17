import { useMemo, useState } from "react";
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
import CardList from "./components/CardList";
import { Card, List } from "./types";
import { createPortal } from "react-dom";
import CardItem from "./components/CardItem";
import CardItemOverlay from "./components/CardItemOverlay";
import CardListOverlay from "./components/CardListOverlay";

export default function App() {
	const [columns, setColumns] = useState([
		{
			id: "1",
			title: "Column 1",
		},
		{
			id: "2",
			title: "Column 2",
		},
		{
			id: "3",
			title: "Column 3",
		},
	]);
	const [cards, setCards] = useState<Card[]>([
		{
			id: "1A",
			title: "Learn React",
			description: "Description 1",
			owner: "Franco",
			columnId: "1",
		},
		{
			id: "4A",
			title: "Learn React asdasdhgasdjagsjdhgasjdhagsdjhagsdjhasgd",
			description: "Description 1",
			owner: "Franco",
			columnId: "1",
		},
		{
			id: "2A",
			title: "Learn Svelte",
			description: "Description 2",
			owner: "Franco",
			columnId: "1",
		},
		{
			id: "3A",
			title: "Learn Node",
			description: "Description 3",
			owner: "Franco",
			columnId: "1",
		},
		{
			id: "1B",
			title: "Learn React",
			description: "Description 1",
			owner: "Franco",
			columnId: "2",
		},
		{
			id: "2B",
			title: "Learn Svelte",
			description: "Description 2",
			owner: "Franco",
			columnId: "2",
		},
		{
			id: "3B",
			title: "Learn Node",
			description: "Description 3",
			owner: "Franco",
			columnId: "2",
		},
	]);
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

		setColumns((lists) => {
			const activeColumnIndex = lists.findIndex(
				(list) => list.id === active.id,
			);
			const overColumnIndex = lists.findIndex((list) => list.id === over.id);

			return arrayMove(lists, activeColumnIndex, overColumnIndex);
		});
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id === over.id) return;
		const isActiveACard = active.data.current?.type === "Card";
		const isOverACard = over.data.current?.type === "Card";

		if (!isActiveACard) return;

		if (isActiveACard && isOverACard) {
			setCards((cards) => {
				const activeCardIndex = cards.findIndex(
					(card) => card.id === active.data.current?.card.id,
				);
				const overCardIndex = cards.findIndex(
					(card) => card.id === over.data.current?.card.id,
				);

				cards[activeCardIndex].columnId = cards[overCardIndex].columnId;

				return arrayMove(cards, activeCardIndex, overCardIndex);
			});
		}

		const isOverAColumn = over.data.current?.type === "Column";
		if (isActiveACard && isOverAColumn) {
			setCards((cards) => {
				const activeCardIndex = cards.findIndex(
					(card) => card.id === active.data.current?.card.id,
				);

				cards[activeCardIndex].columnId = over.data.current?.column.id;

				return arrayMove(cards, activeCardIndex, activeCardIndex);
			});
		}
	};

	const updateColumn = (id: string, title: string) => {
		const newColumns = columns.map((list) => {
			if (list.id !== id) return list;
			return { ...list, title };
		});
		setColumns(newColumns);
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
								updateColumn={updateColumn}
							/>
						))}
					</SortableContext>
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
