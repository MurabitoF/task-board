import { useEffect, useRef } from "react";

interface Props {
	name: string;
	label: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
}

const TextArea: React.FC<Props> = ({ name, label, error, ...props }) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const resizeTextArea = () => {
		if (textareaRef.current !== null) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	useEffect(resizeTextArea, [props.value]);

	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={name} className="font-medium">
				{label} {props.required && <span className="text-red-500">*</span>}
			</label>
			<textarea
				{...props}
				ref={textareaRef}
				className="px-2 py-1 text-lg border-2 max-h-64 border-indigo-400 rounded-lg focus:outline-none resize-none overflow-y-auto"
			/>
			<small className="text-red-500">{error}</small>
		</div>
	);
};

export default TextArea;
