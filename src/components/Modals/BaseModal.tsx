import { MouseEvent, PropsWithChildren, forwardRef } from "react";
import { createPortal } from "react-dom";

interface Props {
	className?: string;
	closeOnClickOutside?: boolean;
	onClose: () => void;
}

const BaseModal = forwardRef<HTMLDialogElement, PropsWithChildren<Props>>(
	({ className, onClose, children, closeOnClickOutside }, dialogRef) => {
		const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
			e.stopPropagation();
			if (e.currentTarget === e.target && closeOnClickOutside) onClose();
		};

		return createPortal(
			<dialog
				ref={dialogRef}
				onClick={handleClick}
				className={`fixed inset-0 z-10 overflow-y-auto rounded-lg shadow-md backdrop:bg-neutral-500/30 dark:backdrop:bg-neutral-900/30 
				backdrop:backdrop-blur-sm dark:bg-neutral-950 dark:text-neutral-100 ${className}`}
			>
				<div className="p-4">{children}</div>
			</dialog>,
			document.body,
		);
	},
);

export default BaseModal;
