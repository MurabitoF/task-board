import React, { HTMLInputTypeAttribute, forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { CardFormValues } from "../../types";

interface Props {
	name: keyof CardFormValues;
	label: string;
	register: UseFormRegister<CardFormValues>;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
}

const Input: React.FC<Props> = ({
	name,
	label,
	type = "text",
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
			<input
				type={type}
				{...register(name, {
					required: required ? `${label} is Required` : "",
				})}
				{...props}
				className="px-2 py-1 text-lg border-2 border-indigo-400 rounded-lg focus:outline-none"
			/>
			<small className="text-red-500">{error}</small>
		</div>
	);
};

export default Input;
