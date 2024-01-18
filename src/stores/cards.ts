import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Card } from "../types";

interface CardStore {
	cards: Card[];
	showModal: boolean;
	selectedListId?: string;
	editCard?: Card;
	setShowModal: (showModal: boolean) => void;
	setEditCard: (editCard: Card | undefined) => void;
	setSelectedListId: (listId: string | undefined) => void;
	setCards: (cards: Card[]) => void;
	addNewCard: (card: Card) => void;
	removeCard: (cardId: string) => void;
	removeCardsFromColumn: (columnId: string) => void;
	updateCard: (updatedCard: Card) => void;
}

const useCardStore = create<CardStore>()(
	persist(
		(set) => ({
			cards: [],
			showModal: false,
			editCard: undefined,
			selectedListId: undefined,
			setSelectedListId: (selectedListId) => set({ selectedListId }),
			setShowModal: (showModal) => set({ showModal }),
			setEditCard: (editCard) => set({ editCard }),
			setCards: (cards) => set({ cards }),
			addNewCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
			removeCard: (cardId) =>
				set((state) => ({
					cards: state.cards.filter((card) => card.id !== cardId),
				})),
			removeCardsFromColumn: (columnId) =>
				set((state) => ({
					cards: state.cards.filter((card) => card.columnId !== columnId),
				})),
			updateCard: (updatedCard) =>
				set((state) => ({
					cards: state.cards.map((card) => {
						if (card.id !== updatedCard.id) return card;
						return updatedCard;
					}),
				})),
		}),
		{
			name: "cards-storage",
		},
	),
);

export default useCardStore;
