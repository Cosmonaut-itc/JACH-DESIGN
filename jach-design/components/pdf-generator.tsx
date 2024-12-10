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

		// Letter size dimensions in points (8.5" x 11")
		const LETTER_WIDTH = 612;
		const LETTER_HEIGHT = 792;

		// Initialize PDF in Letter format
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'pt',
			format: 'letter',
		});

		const padding = 40; // Increased padding for better margins
		const headerHeight = 90; // Space reserved for header content

		// Calculate available space for the exhibition area
		const availableWidth = LETTER_WIDTH - 2 * padding;
		const availableHeight = LETTER_HEIGHT - headerHeight - 2 * padding;

		// Calculate the number of dots
		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);
		const calculatedDots = cols * rows;

		// Header information with improved positioning
		pdf.setFontSize(10); // Slightly larger font for better readability
		pdf.text(`Cliente: ${clientName}`, padding, padding);
		pdf.text(`Vendedor: ${sellerName}`, padding, padding + 15);
		pdf.text(`Proyecto: ${projectName}`, padding, padding + 30);
		pdf.text(`Fecha de Entrega: ${deliveryDate}`, padding, padding + 45);

		// Calculate the scaling factor to fit the exhibition area
		const scaleX = availableWidth / (length * 2.83465);
		const scaleY = availableHeight / (height * 2.83465);
		const scale = Math.min(scaleX, scaleY);

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
		pdf.line(padding, headerHeight + 15, LETTER_WIDTH - padding, headerHeight + 15);

		// Calculate the actual dimensions after scaling
		const actualWidth = length * 2.83465 * scale;
		const actualHeight = height * 2.83465 * scale;

		// Center the exhibition area
		const startX = padding + (availableWidth - actualWidth) / 2;
		const startY = headerHeight + (availableHeight - actualHeight) / 2;

		// Draw exhibition area outline
		pdf.setDrawColor(0);
		pdf.setLineWidth(0.5);
		pdf.rect(startX, startY, actualWidth, actualHeight);

		// Calculate the drawable area (excluding the border)
		const drawableWidth = actualWidth - 10; // Subtract 2 points for the border
		const drawableHeight = actualHeight - 10;

		// Calculate spacing between dots using the drawable area
		const spacingX = drawableWidth / (cols - 1);
		const spacingY = drawableHeight / (rows - 1);

		// Calculate dot size (smaller of the two spacings, with a maximum size)
		const dotSize = Math.min(spacingX, spacingY, 4) * 0.7;

		// Draw dots with proper margins, offset by 1 point from the border
		pdf.setFillColor(255, 0, 0);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const x = startX + 4 + j * spacingX; // Add 1 point offset from left border
				const y = startY + 4 + i * spacingY; // Add 1 point offset from top border
				pdf.circle(x, y, dotSize / 2, 'F');
			}
		}

		pdf.save(`exhibicion_${clientName}_${deliveryDate}.pdf`);
	};

	return (
		<div className="mt-4">
			<Button onClick={generatePDF} className="w-full">
				Generar PDF
			</Button>
		</div>
	);
}
