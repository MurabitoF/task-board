import { useEffect, useMemo, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { CardFormValues } from "../../types";
import useCardStore from "../../stores/cards";
import BaseModal from "./BaseModal";
import Close from "../Icons/Close";
import Input from "../Inputs/Input";
import TextArea from "../Inputs/TextArea";

interface Props {
	open: boolean;
	onClose: () => void;
}

const CardModal: React.FC<Props> = ({ open, onClose }) => {
	const { addNewCard, updateCard, selectedListId, editCard } = useCardStore();
	const dialogRef = useRef<HTMLDialogElement>(null);

	const isEditing = useMemo(() => editCard !== undefined, [editCard]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CardFormValues>({
		defaultValues: {
			title: editCard?.title,
			description: editCard?.description,
		},
	});

	useEffect(() => {
		if (open) dialogRef.current?.showModal();
		else dialogRef.current?.close();
	}, [dialogRef, open]);

	const handleAccept: SubmitHandler<CardFormValues> = (data) => {
		if (editCard === undefined) {
			const newCard = {
				...data,
				id: uuid(),
				owner: "Franco",
				columnId: selectedListId!,
			};
			addNewCard(newCard);
			onClose();
			return;
		}

		const updatedCard = { ...editCard, ...data };
		updateCard(updatedCard);
		onClose();
	};

	const handleClose = () => {
		onClose();
		dialogRef.current?.close();
	};

	return (
		<BaseModal ref={dialogRef} onClose={handleClose} className="w-[700px]">
			<div className="pb-4 flex justify-between items-center">
				<h2 className="text-xl font-semibold">
					{isEditing ? "Edit Task" : "New Task"}
				</h2>
				<button
					onClick={handleClose}
					className="stroke-neutral-400 hover:stroke-neutral-600"
				>
					<Close />
				</button>
			</div>
			<form>
				<Input
					name="title"
					label="Title"
					register={register}
					required
					placeholder="Task Title"
					error={errors.title?.message}
				/>
				<TextArea
					name="description"
					label="Description"
					placeholder="Task Description"
					register={register}
				/>
			</form>
			<div className="pt-4 flex gap-4 items-center justify-end">
				<button
					className="px-3 py-2 rounded-lg font-medium hover:bg-neutral-400/30 transition-all"
					onClick={handleClose}
				>
					Cancel
				</button>
				<button
					className="px-3 py-2 rounded-lg text-white font-medium bg-indigo-500 hover:opacity-90 transition-all"
					onClick={handleSubmit(handleAccept)}
				>
					Accept
				</button>
			</div>
		</BaseModal>
	);
};

export default CardModal;
