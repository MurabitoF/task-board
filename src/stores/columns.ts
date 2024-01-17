import { create } from "zustand";
import { persist } from "zustand/middleware";
import { List } from "../types";

interface ColumnStore {
	columns: List[];
	setColumns: (columns: List[]) => void;
	addNewColumn: (column: List) => void;
	removeColumn: (columnId: string) => void;
	updateColumn: (columnId: string, title: string) => void;
}

const useColumnStore = create<ColumnStore>()(
	persist(
		(set) => ({
			columns: [],
			setColumns: (columns) => set({ columns }),
			addNewColumn: (column) =>
				set((state) => ({ columns: [...state.columns, column] })),
			removeColumn: (columnId) =>
				set((state) => ({
					columns: state.columns.filter((column) => column.id !== columnId),
				})),
			updateColumn: (columnId, title) =>
				set((state) => ({
					columns: state.columns.map((column) => {
						if (column.id !== columnId) return column;
						return { ...column, title };
					}),
				})),
		}),
		{
			name: "columns-storage",
		},
	),
);

export default useColumnStore;
