'use client';

import { jsPDF } from 'jspdf';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PDFGeneratorProps {
	data: ExhibitionData;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
	const generatePDF = () => {
		// Destructure the exhibition data
		const { length, height, dots, separation } = data;

		// Define the scale factor for converting centimeters to points
		// We use 2.83465 for more precise conversion (1 cm = 28.3465 points)
		const scale = 2.83465;

		// Create new PDF document with proper configuration
		const pdf = new jsPDF({
			orientation: height > length ? 'portrait' : 'landscape',
			unit: 'pt',
			format: [height * scale, length * scale],
		});

		// Calculate grid dimensions
		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);

		// Draw the outer rectangle for the exhibition area
		// Add some padding to ensure the border is visible
		const padding = 10; // 10 points padding
		pdf.setDrawColor(0); // Black color for the border
		pdf.setLineWidth(0.5); // Set a thinner line width for better appearance
		pdf.rect(padding, padding, length * scale - 2 * padding, height * scale - 2 * padding);

		// Configure and draw the dots
		pdf.setFillColor(255, 0, 0); // Red color for the dots
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (i * cols + j >= dots) break;

				// Calculate dot position with padding
				const x = (j * separation + separation / 2) * scale + padding;
				const y = (i * separation + separation / 2) * scale + padding;

				// Draw filled circle without quotes in the style parameter
				pdf.circle(x, y, 2 * scale, 'F');
			}
		}

		// Save the PDF with a clean filename (no extra quotes)
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
