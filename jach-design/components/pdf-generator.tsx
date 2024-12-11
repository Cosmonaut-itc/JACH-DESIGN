'use client';

import { jsPDF } from 'jspdf';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PDFGeneratorProps {
	data: ExhibitionData;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
	const generatePDF = () => {
		const {
			length,
			height,
			separation,
			clientName,
			sellerName,
			projectName,
			deliveryDate,
			productCodes,
		} = data;

		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'pt',
			format: 'letter',
		});

		const padding = 40;
		const headerHeight = 120;

		const LETTER_WIDTH = 612;
		const LETTER_HEIGHT = 792;

		const availableWidth = LETTER_WIDTH - 2 * padding;
		const availableHeight = LETTER_HEIGHT - headerHeight - 2 * padding;

		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);
		const calculatedDots = cols * rows;

		// Header information
		pdf.setFontSize(10);
		pdf.text(`Cliente: ${clientName}`, padding, padding);
		pdf.text(`Vendedor: ${sellerName}`, padding, padding + 15);
		pdf.text(`Proyecto: ${projectName}`, padding, padding + 30);
		pdf.text(`Fecha de Entrega: ${deliveryDate.toLocaleDateString()}`, padding, padding + 45);

		// Calculate edge-to-point distances
		const horizontalEdgeSpace = (length - (cols - 1) * separation) / 2;
		const verticalEdgeSpace = (height - (rows - 1) * separation) / 2;

		// Round measurements to one decimal place for cleaner display
		const roundToOne = (num: number) => Math.round(num * 10) / 10;

		pdf.text(`Dimensiones: ${length}cm x ${height}cm`, LETTER_WIDTH - 280, padding);
		pdf.text(`Separación entre puntos: ${separation}cm`, LETTER_WIDTH - 280, padding + 15);
		pdf.text(`Total de Puntos: ${calculatedDots}`, LETTER_WIDTH - 280, padding + 30);
		pdf.text(
			`Distancia al borde (Horizontal): ${roundToOne(horizontalEdgeSpace)}cm`,
			LETTER_WIDTH - 280,
			padding + 45,
		);
		pdf.text(
			`Distancia al borde (Vertical): ${roundToOne(verticalEdgeSpace)}cm`,
			LETTER_WIDTH - 280,
			padding + 60,
		);

		// Separator line
		pdf.setDrawColor(200);
		pdf.line(padding, headerHeight - 15, LETTER_WIDTH - padding, headerHeight - 15);

		// Calculate scaling factor
		const scaleX = availableWidth / length;
		const scaleY = availableHeight / height;
		const scale = Math.min(scaleX, scaleY);

		// Calculate start position to center the drawing
		const startX = padding + (availableWidth - length * scale) / 2;
		const startY = headerHeight + (availableHeight - height * scale) / 2;

		// Draw exhibition area outline
		pdf.setDrawColor(0);
		pdf.setLineWidth(0.5);
		pdf.rect(startX, startY, length * scale, height * scale);

		// Draw mounting points and product codes
		pdf.setFillColor(255, 0, 0);
		pdf.setFontSize(6);
		let index = 0;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const x = startX + j * separation * scale;
				const y = startY + i * separation * scale;
				pdf.circle(x, y, 2 * scale, 'F');

				if (productCodes && productCodes[index]) {
					pdf.text(productCodes[index], x + 3 * scale, y + 3 * scale, { align: 'left' });
				}

				index++;
			}
		}

		pdf.save(`exhibicion_${clientName}_${deliveryDate.toISOString().split('T')[0]}.pdf`);
	};

	return (
		<div className="mt-4">
			<Button onClick={generatePDF} className="w-full">
				Generar PDF
			</Button>
		</div>
	);
}
