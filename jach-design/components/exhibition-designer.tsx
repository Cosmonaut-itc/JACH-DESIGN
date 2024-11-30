'use client';

import { useState } from 'react';
import { ExhibitionForm } from './exhibition-form';
import { ExhibitionPreview } from './exhibition-preview';
import { PDFGenerator } from './pdf-generator';
import { ExhibitionData } from '@/lib/types';

export default function ExhibitionDesigner() {
	const [exhibitionData, setExhibitionData] = useState<ExhibitionData | null>(null);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
				Diseñador de Exhibición Jach
			</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:gap-8">
				<div className="space-y-6">
					<ExhibitionForm onSubmitAction={setExhibitionData} />
					{exhibitionData && <PDFGenerator data={exhibitionData} />}
				</div>
				{exhibitionData && <ExhibitionPreview data={exhibitionData} />}
			</div>
		</div>
	);
}
