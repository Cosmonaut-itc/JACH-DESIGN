'use client';

import { jsPDF } from 'jspdf';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PDFGeneratorProps {
	data: ExhibitionData;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
	const generatePDF = () => {
		const { length, height, separation } = data;

		const scale = 2.83465;
		const padding = 10;

		const pdf = new jsPDF({
			orientation: height > length ? 'portrait' : 'landscape',
			unit: 'pt',
			format: [height * scale, length * scale],
		});

		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);

		pdf.setDrawColor(0);
		pdf.setLineWidth(0.5);
		pdf.rect(padding, padding, length * scale - 2 * padding, height * scale - 2 * padding);

		pdf.setFillColor(255, 0, 0);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const x = (j * separation + separation / 2) * scale + padding;
				const y = (i * separation + separation / 2) * scale + padding;
				pdf.circle(x, y, 2 * scale, 'F');
			}
		}

		pdf.save('exhibition-layout.pdf');
	};

	return (
		<div className="mt-4">
			<Button onClick={generatePDF} className="w-full">
				Generar PDF
			</Button>
		</div>
	);
}
