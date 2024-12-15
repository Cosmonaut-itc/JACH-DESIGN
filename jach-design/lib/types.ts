import { z } from 'zod';

export const ExhibitionDataSchema = z.object({
	length: z.number().positive(),
	height: z.number().positive(),
	horizontalSeparation: z.number().positive(),
	verticalSeparation: z.number().positive(),
	clientName: z.string().min(1),
	sellerName: z.string().min(1),
	projectName: z.string().min(1),
	deliveryDate: z.date(),
	productCodes: z.array(z.string()).optional(),
});

export type ExhibitionData = z.infer<typeof ExhibitionDataSchema>;
