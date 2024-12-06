'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button as Button2 } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formSchema = z.object({
	length: z.union([
		z.number().positive('El largo debe ser positivo').max(1000, 'El largo máximo es 1000cm'),
		z.string().refine((val) => val === '', { message: 'El largo debe ser positivo' }),
	]),
	height: z.union([
		z.number().positive('La altura debe ser positiva').max(1000, 'La altura máxima es 1000cm'),
		z.string().refine((val) => val === '', { message: 'La altura debe ser positiva' }),
	]),
	separation: z.union([
		z
			.number()
			.positive('La separación debe ser positiva')
			.max(100, 'La separación máxima es 100cm'),
		z.string().refine((val) => val === '', { message: 'La separación debe ser positiva' }),
	]),
	clientName: z.string().min(1, 'El nombre del cliente es requerido'),
	sellerName: z.string().min(1, 'El nombre del vendedor es requerido'),
	projectName: z.string().min(1, 'El nombre del proyecto es requerido'),
	deliveryDate: z.date({
		required_error: 'La fecha de entrega es requerida',
	}),
});

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
			clientName: '',
			sellerName: '',
			projectName: '',
			deliveryDate: new Date(),
		},
		mode: 'onChange',
	});

	const handleSubmit = useCallback(
		(values: z.infer<typeof formSchema>) => {
			const numericValues = {
				length: typeof values.length === 'number' ? values.length : 0,
				height: typeof values.height === 'number' ? values.height : 0,
				separation: typeof values.separation === 'number' ? values.separation : 0,
			};

			if (numericValues.length && numericValues.height && numericValues.separation) {
				onSubmitAction({
					...numericValues,
					clientName: values.clientName,
					sellerName: values.sellerName,
					projectName: values.projectName,
					deliveryDate: format(values.deliveryDate, 'yyyy-MM-dd'),
				});
			}
		},
		[onSubmitAction],
	);

	const handleFieldChange = useCallback((field: any, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? '' : parseFloat(e.target.value);
		field.onChange(value);
	}, []);

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
				<FormField
					control={form.control}
					name="clientName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre del Cliente</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sellerName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre del Vendedor</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="projectName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre del Proyecto</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="deliveryDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Fecha de Entrega</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button2
											variant={'outline'}
											className={cn(
												'w-full pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground',
											)}>
											{field.value ? (
												format(field.value, 'PPP', { locale: es })
											) : (
												<span>Seleccionar fecha</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button2>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date() ||
											date >
												new Date(
													new Date().setFullYear(
														new Date().getFullYear() + 1,
													),
												)
										}
										initialFocus
										locale={es}
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Selecciona la fecha de entrega del proyecto.
							</FormDescription>
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
