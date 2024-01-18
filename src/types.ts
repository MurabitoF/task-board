export interface Card {
	id: string;
	title: string;
	description: string;
	owner: string;
	columnId: string;
}

export interface List {
	id: string;
	title: string;
}

export interface CardFormValues {
	title: string;
	description: string;
}
