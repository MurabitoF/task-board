import React, { useEffect, useRef } from "react";

import BaseModal from "./BaseModal";
import Close from "../Icons/Close";

interface Props {
	open: boolean;
	title: string;
	message: string;
	onAccept: () => void;
	onClose: () => void;
}

const ConfirmModal: React.FC<Props> = ({
	open,
	title,
	message,
	onAccept,
	onClose,
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (open) dialogRef.current?.showModal();
		else dialogRef.current?.close();
	}, [dialogRef, open]);

	const handleClose = () => {
		onClose();
		dialogRef.current?.close();
	};

	return (
		<BaseModal
			ref={dialogRef}
			onClose={handleClose}
			className="w-[550px]"
			closeOnClickOutside
		>
			<div className="pb-4 flex justify-between items-center">
				<h2 className="text-xl font-semibold">{title}</h2>
				<button
					onClick={handleClose}
					className="stroke-neutral-400 hover:stroke-neutral-600"
				>
					<Close />
				</button>
			</div>
			<p className="px-3 py-6 text-pretty">{message}</p>
			<div className="pt-4 flex gap-4 items-center justify-end">
				<button
					className="px-3 py-2 rounded-lg font-medium hover:bg-neutral-400/30 transition-all"
					onClick={handleClose}
				>
					Cancel
				</button>
				<button
					className="px-3 py-2 rounded-lg text-white font-medium bg-indigo-500 hover:opacity-90 transition-all"
					onClick={onAccept}
				>
					Accept
				</button>
			</div>
		</BaseModal>
	);
};

export default ConfirmModal;
