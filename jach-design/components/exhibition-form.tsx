'use client';

// ExhibitionForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExhibitionData } from '@/lib/types';
import React, { useCallback } from 'react';

// Improved form schema with better validation
const formSchema = z.object({
	length: z.union([
		z.number().positive('El largo debe ser positivo').max(1000, 'El largo máximo es 1000cm'),
		z.string().refine((val) => val === "''", { message: 'El largo debe ser positivo' }),
	]),
	height: z.union([
		z.number().positive('La altura debe ser positiva').max(1000, 'La altura máxima es 1000cm'),
		z.string().refine((val) => val === "''", { message: 'La altura debe ser positiva' }),
	]),
	separation: z.union([
		z
			.number()
			.positive('La separación debe ser positiva')
			.max(100, 'La separación máxima es 100cm'),
		z.string().refine((val) => val === "''", { message: 'La separación debe ser positiva' }),
	]),
});

type FormValues = z.infer<typeof formSchema>;

interface ExhibitionFormProps {
	onSubmitAction: (data: ExhibitionData) => void;
}

export function ExhibitionForm({ onSubmitAction }: ExhibitionFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			length: 215,
			height: 220,
			separation: 30,
		},
		mode: 'onChange', // Enable real-time validation
	});

	// Memoize the submit handler to prevent unnecessary rerenders
	const handleSubmit = useCallback(
		(values: z.infer<typeof formSchema>) => {
			const numericValues = {
				length: typeof values.length === 'number' ? values.length : 0,
				height: typeof values.height === 'number' ? values.height : 0,
				separation: typeof values.separation === 'number' ? values.separation : 0,
			};

			if (numericValues.length && numericValues.height && numericValues.separation) {
				const calculatedDots = Math.floor(
					(numericValues.length / numericValues.separation) *
						(numericValues.height / numericValues.separation),
				);
				onSubmitAction({ ...numericValues, calculatedDots });
			}
		},
		[onSubmitAction],
	);

	// Memoize the field change handler
	const handleFieldChange = useCallback(
		(
			field: ControllerRenderProps<FormValues, keyof FormValues>,
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const value = e.target.value === '' ? '' : parseFloat(e.target.value);
			field.onChange(value);
		},
		[],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="length"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Largo (cm)</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										max={1000}
										{...field}
										onChange={(e) => handleFieldChange(field, e)}
									/>
								</FormControl>
								<FormDescription>El largo del área de exhibición</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Altura (cm)</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										max={1000}
										{...field}
										onChange={(e) => handleFieldChange(field, e)}
									/>
								</FormControl>
								<FormDescription>La altura del área de exhibición</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="separation"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Separación (cm)</FormLabel>
							<FormControl>
								<Input
									type="number"
									min={1}
									max={100}
									{...field}
									onChange={(e) => handleFieldChange(field, e)}
								/>
							</FormControl>
							<FormDescription>La separación mínima entre puntos</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={!form.formState.isValid}>
					Generar Vista Previa
				</Button>
			</form>
		</Form>
	);
}
