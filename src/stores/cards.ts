import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Card } from "../types";

const CARDS_MOCK = [
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
];

interface CardStore {
	cards: Card[];
	setCards: (cards: Card[]) => void;
	addNewCard: (card: Card) => void;
	removeCard: (cardId: string) => void;
	updateCard: (updatedCard: Card) => void;
}

const useCardStore = create<CardStore>()(
	persist(
		(set) => ({
			cards: CARDS_MOCK,
			setCards: (cards) => set({ cards }),
			addNewCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
			removeCard: (cardId) =>
				set((state) => ({
					cards: state.cards.filter((card) => card.id !== cardId),
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
