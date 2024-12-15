import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface ProductCodeGridProps {
	length: number;
	height: number;
	horizontalSeparation: number;
	verticalSeparation: number;
	productCodes: string[];
	onChange: (codes: string[]) => void;
}

const ProductCodeGrid = ({
	length,
	height,
	horizontalSeparation,
	verticalSeparation,
	productCodes,
	onChange,
}: ProductCodeGridProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState('');

	// Calculate grid dimensions
	const cols = Math.floor(length / horizontalSeparation);
	const rows = Math.floor(height / verticalSeparation);

	// Calculate edge spaces
	const horizontalEdgeSpace = (length - (cols - 1) * horizontalSeparation) / 2;
	const verticalEdgeSpace = (height - (rows - 1) * verticalSeparation) / 2;

	// Calculate scale factor
	useEffect(() => {
		if (containerRef.current) {
			const containerWidth = containerRef.current.clientWidth - 40; // subtract padding
			const containerHeight = containerRef.current.clientHeight - 40;
			const scaleX = containerWidth / length;
			const scaleY = containerHeight / height;
			setScale(Math.min(scaleX, scaleY, 1)); // Never scale up, only down if needed
		}
	}, [length, height, containerRef]);

	const handlePointClick = (index: number) => {
		setSelectedPoint(index);
		setInputValue(productCodes[index] || '');
	};

	const handleCodeSubmit = () => {
		if (selectedPoint !== null) {
			const newCodes = [...productCodes];
			newCodes[selectedPoint] = inputValue;
			onChange(newCodes);
			setSelectedPoint(null);
			setInputValue('');
		}
	};

	const getPointPosition = (index: number) => {
		const row = Math.floor(index / cols);
		const col = index % cols;
		return {
			row,
			col,
			// Calculate actual positions including edge spaces
			x: horizontalEdgeSpace + col * horizontalSeparation,
			y: verticalEdgeSpace + row * verticalSeparation,
		};
	};

	return (
		<div className="space-y-4">
			<div
				ref={containerRef}
				className="p-4 border rounded-lg bg-white"
				style={{ height: '500px' }}>
				<div className="relative w-full h-full overflow-auto">
					<div
						style={{
							width: length,
							height: height,
							position: 'relative',
							transform: `scale(${scale})`,
							transformOrigin: 'top left',
							border: '1px solid #ccc',
							background: '#fff',
						}}>
						{Array.from({ length: rows * cols }).map((_, index) => {
							const { x, y, row, col } = getPointPosition(index);
							return (
								<Dialog key={index}>
									<DialogTrigger asChild>
										<button
											className={`absolute rounded-full w-8 h-8 -ml-4 -mt-4 flex items-center justify-center text-xs
                        ${productCodes[index] ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                        ${selectedPoint === index ? 'ring-2 ring-blue-400' : ''}
                        hover:bg-blue-400 transition-colors`}
											style={{
												left: x,
												top: y,
												cursor: 'pointer',
											}}
											onClick={() => handlePointClick(index)}>
											{productCodes[index] ? '✓' : '+'}
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Punto de Montaje ({col + 1}, {row + 1})
											</DialogTitle>
										</DialogHeader>
										<div className="space-y-4 p-4">
											<div className="text-sm text-gray-500">
												Posición: {x.toFixed(1)}cm x {y.toFixed(1)}cm
											</div>
											<Input
												placeholder="Ingrese código de producto"
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
											/>
											<Button className="w-full" onClick={handleCodeSubmit}>
												Guardar Código
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							);
						})}
					</div>
				</div>
			</div>

			<div className="mt-4 p-4 border rounded-lg">
				<h3 className="font-medium mb-2">Resumen de Códigos</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
					{productCodes.map((code, index) => {
						if (!code) return null;
						const { row, col } = getPointPosition(index);
						return (
							<div key={index} className="text-sm p-2 bg-gray-50 rounded">
								({col + 1}, {row + 1}): {code}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ProductCodeGrid;
