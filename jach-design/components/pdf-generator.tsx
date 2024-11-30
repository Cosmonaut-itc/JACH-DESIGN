"'use client'";

import { jsPDF } from 'jspdf';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PDFGeneratorProps {
	data: ExhibitionData;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
	//const canvasRef = useRef<HTMLCanvasElement>(null);

	const generatePDF = () => {
		const { length, height, dots, separation } = data;
		const scale = 2.83; // Convert cm to PDF points (1 cm = 28.3 points)

		const pdf = new jsPDF({
			orientation: height > length ? 'portrait' : 'landscape',
			unit: 'pt',
			format: [height * scale, length * scale],
		});

		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);

		// Draw rectangle
		pdf.setDrawColor(0);
		pdf.rect(0, 0, length * scale, height * scale);

		// Draw dots
		pdf.setFillColor(255, 0, 0);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (i * cols + j >= dots) break;
				const x = (j * separation + separation / 2) * scale;
				const y = (i * separation + separation / 2) * scale;
				pdf.circle(x, y, 2 * scale, "'F'");
			}
		}

		pdf.save("'exhibition-layout.pdf'");
	};

	return (
		<div className="mt-4">
			<Button onClick={generatePDF} className="w-full">
				Generar PDF
			</Button>
		</div>
	);
}
