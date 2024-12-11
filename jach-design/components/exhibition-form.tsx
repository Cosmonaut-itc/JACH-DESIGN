'use client';

import { useState } from 'react';
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
import { ExhibitionData, ExhibitionDataSchema } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ExhibitionFormProps {
	onSubmitAction: (data: ExhibitionData) => void;
}

export function ExhibitionForm({ onSubmitAction }: ExhibitionFormProps) {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<Partial<ExhibitionData>>({});

	const form = useForm<z.infer<typeof ExhibitionDataSchema>>({
		resolver: zodResolver(ExhibitionDataSchema),
		defaultValues: {
			length: 215,
			height: 220,
			separation: 30,
			clientName: '',
			sellerName: '',
			projectName: '',
			deliveryDate: new Date(),
			productCodes: [],
		},
	});

	const handleNextStep = (data: Partial<ExhibitionData>) => {
		setFormData({ ...formData, ...data });
		setStep(step + 1);
	};

	const handlePreviousStep = () => {
		setStep(step - 1);
	};

	const handleSubmit = (values: z.infer<typeof ExhibitionDataSchema>) => {
		const finalData = { ...formData, ...values };
		onSubmitAction(finalData as ExhibitionData);
	};

	const calculateMountingPoints = () => {
		const { length, height, separation } = formData;
		if (length && height && separation) {
			const cols = Math.floor(length / separation);
			const rows = Math.floor(height / separation);
			return cols * rows;
		}
		return 0;
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				{step === 1 && (
					<>
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
												{...field}
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value))
												}
											/>
										</FormControl>
										<FormDescription>
											El largo del área de exhibición
										</FormDescription>
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
												{...field}
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value))
												}
											/>
										</FormControl>
										<FormDescription>
											La altura del área de exhibición
										</FormDescription>
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
											{...field}
											onChange={(e) =>
												field.onChange(parseFloat(e.target.value))
											}
										/>
									</FormControl>
									<FormDescription>
										La separación mínima entre puntos
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="button" onClick={() => handleNextStep(form.getValues())}>
							Siguiente
						</Button>
					</>
				)}

				{step === 2 && (
					<>
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
												<Button
													variant={'outline'}
													className={cn(
														'w-[240px] pl-3 text-left font-normal',
														!field.value &&
															'text-neutral-500 dark:text-neutral-400',
													)}>
													{field.value ? (
														format(field.value, 'PPP', { locale: es })
													) : (
														<span>Selecciona una fecha</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
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
														new Date(new Date().getFullYear() + 1, 0, 1)
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
						<div className="flex justify-between">
							<Button type="button" onClick={handlePreviousStep}>
								Anterior
							</Button>
							<Button type="button" onClick={() => handleNextStep(form.getValues())}>
								Siguiente
							</Button>
						</div>
					</>
				)}

				{step === 3 && (
					<>
						<FormField
							control={form.control}
							name="productCodes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Códigos de Producto</FormLabel>
									<FormDescription>
										Ingrese los códigos de producto para cada punto de montaje.
										Se necesitan {calculateMountingPoints()} códigos.
									</FormDescription>
									<div className="grid gap-2">
										{Array.from({ length: calculateMountingPoints() }).map(
											(_, index) => (
												<FormControl key={index}>
													<Input
														placeholder={`Código para el punto ${index + 1}`}
														value={field.value?.[index] || "''"}
														onChange={(e) => {
															const newCodes = [
																...(field.value || []),
															];
															newCodes[index] = e.target.value;
															field.onChange(newCodes);
														}}
													/>
												</FormControl>
											),
										)}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-between">
							<Button type="button" onClick={handlePreviousStep}>
								Anterior
							</Button>
							<Button type="submit">Generar Vista Previa</Button>
						</div>
					</>
				)}
			</form>
		</Form>
	);
}
