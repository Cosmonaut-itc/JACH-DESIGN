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

const formSchema = z.object({
	length: z.number().positive("'El largo debe ser positivo'"),
	height: z.number().positive("'La altura debe ser positiva'"),
	dots: z.number().int().positive("'El número de puntos debe ser un entero positivo'"),
	separation: z.number().positive("'La separación debe ser positiva'"),
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
			dots: 35,
			separation: 30,
		},
	});

	function handleSubmit(values: z.infer<typeof formSchema>) {
		onSubmitAction(values);
	}

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
										{...field}
										onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
										{...field}
										onChange={(e) => field.onChange(parseFloat(e.target.value))}
									/>
								</FormControl>
								<FormDescription>La altura del área de exhibición</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="dots"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número de Puntos</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										onChange={(e) =>
											field.onChange(parseInt(e.target.value, 10))
										}
									/>
								</FormControl>
								<FormDescription>La cantidad de puntos a colocar</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
										onChange={(e) => field.onChange(parseFloat(e.target.value))}
									/>
								</FormControl>
								<FormDescription>La separación mínima entre puntos</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" className="w-full">
					Generar Vista Previa
				</Button>
			</form>
		</Form>
	);
}
