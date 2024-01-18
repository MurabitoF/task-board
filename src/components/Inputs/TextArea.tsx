import { UseFormRegister } from "react-hook-form";

import { CardFormValues } from "../../types";

interface Props {
	name: keyof CardFormValues;
	label: string;
	register: UseFormRegister<CardFormValues>;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
}

const TextArea: React.FC<Props> = ({
	name,
	label,
	error,
	register,
	required,
	...props
}) => {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={name} className="font-medium">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<textarea
				{...register(name, {
					required: required ? `${label} is Required` : "",
				})}
				{...props}
				className="px-2 py-1 text-lg border-2 max-h-64 border-indigo-400 rounded-lg focus:outline-none resize-none overflow-y-auto"
			/>
			<small className="text-red-500">{error}</small>
		</div>
	);
};

export default TextArea;
