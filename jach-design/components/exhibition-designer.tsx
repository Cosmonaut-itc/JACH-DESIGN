'use client';

import { useState } from 'react';
import { ExhibitionForm } from '@/components/exhibition-form';
import { ExhibitionPreview } from '@/components/exhibition-preview';
import { PDFGenerator } from '@/components/pdf-generator';
import { ExhibitionData } from '@/lib/types';

export default function Home() {
	const [exhibitionData, setExhibitionData] = useState<ExhibitionData | null>(null);

	const handleFormSubmit = (data: ExhibitionData) => {
		setExhibitionData(data);
	};

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">JACH Exhibition Design</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<ExhibitionForm onSubmitAction={handleFormSubmit} />
				</div>
				<div>
					{exhibitionData && (
						<>
							<h2 className="text-xl font-semibold mb-2">Vista Previa 3D</h2>
							<ExhibitionPreview data={exhibitionData} />
							<PDFGenerator data={exhibitionData} />
						</>
					)}
				</div>
			</div>
		</main>
	);
}
