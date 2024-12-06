'use client';

import { jsPDF } from 'jspdf';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PDFGeneratorProps {
	data: ExhibitionData;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
	const generatePDF = () => {
		const { length, height, separation, clientName, sellerName, projectName, deliveryDate } =
			data;

		const scale = 2.83465;
		const padding = 10;
		const pageWidth = (height > length ? height : length) * scale;
		const pageHeight = (height > length ? length : height) * scale;

		const pdf = new jsPDF({
			orientation: height > length ? 'portrait' : 'landscape',
			unit: 'pt',
			format: [pageWidth, pageHeight],
		});

		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);
		const calculatedDots = cols * rows;

		// Header information
		pdf.setFontSize(8);
		pdf.text(`Cliente: ${clientName}`, padding, padding + 15);
		pdf.text(`Vendedor: ${sellerName}`, padding, padding + 30);
		pdf.text(`Proyecto: ${projectName}`, padding, padding + 45);
		pdf.text(`Fecha de Entrega: ${deliveryDate}`, padding, padding + 60);

		pdf.text(`Dimensiones: ${length}cm x ${height}cm`, pageWidth - 200, padding + 15);
		pdf.text(`Separación: ${separation}cm`, pageWidth - 200, padding + 30);
		pdf.text(`Total de Puntos: ${calculatedDots}`, pageWidth - 200, padding + 45);

		// Separator line
		pdf.setDrawColor(200);
		pdf.line(padding, padding + 75, pageWidth - padding, padding + 75);

		// Exhibition area calculations
		const startY = padding + 90;
		const availableWidth = pageWidth - 2 * padding;
		const availableHeight = pageHeight - startY - padding;

		// Draw exhibition area outline
		pdf.setDrawColor(0);
		pdf.setLineWidth(0.5);
		pdf.rect(padding, startY, availableWidth, availableHeight);

		// Calculate spacing between dots
		const spacingX = availableWidth / (cols - 1);
		const spacingY = availableHeight / (rows - 1);
		const dotSize = Math.min(spacingX, spacingY, 4 * scale) * 0.3;

		// Draw dots
		pdf.setFillColor(255, 0, 0);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const x = padding + j * spacingX;
				const y = startY + i * spacingY;
				pdf.circle(x, y, dotSize / 2, 'F');
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
