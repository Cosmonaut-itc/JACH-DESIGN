import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface ProductCodeTableProps {
	length: number;
	height: number;
	horizontalSeparation: number;
	verticalSeparation: number;
	productCodes: string[];
	onChange: (codes: string[]) => void;
}

const ProductCodeTable = ({
	length,
	height,
	horizontalSeparation,
	verticalSeparation,
	productCodes,
	onChange,
}: ProductCodeTableProps) => {
	const cols = Math.floor(length / horizontalSeparation);
	const rows = Math.floor(height / verticalSeparation);
	const [sortBy, setSortBy] = useState<'position' | 'code'>('position');
	const [filterEmpty, setFilterEmpty] = useState(false);

	const getPointDetails = (index: number) => {
		const row = Math.floor(index / cols);
		const col = index % cols;
		const x = col * horizontalSeparation;
		const y = row * verticalSeparation;
		return {
			row: row + 1,
			col: col + 1,
			x: x.toFixed(1),
			y: y.toFixed(1),
			code: productCodes[index] || '',
			index,
		};
	};

	const handleCodeChange = (index: number, value: string) => {
		const newCodes = [...productCodes];
		newCodes[index] = value;
		onChange(newCodes);
	};

	const points = Array.from({ length: rows * cols }).map((_, index) => getPointDetails(index));

	const sortedPoints = [...points].sort((a, b) => {
		if (sortBy === 'code') {
			return (a.code || '').localeCompare(b.code || '');
		}
		return a.index - b.index;
	});

	const filteredPoints = filterEmpty ? sortedPoints.filter((point) => point.code) : sortedPoints;

	return (
		<div className="space-y-4">
			<div className="flex gap-4 items-center">
				<div className="flex-1">
					<Select
						value={sortBy}
						onValueChange={(value: 'position' | 'code') => setSortBy(value)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Ordenar por..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="position">Ordenar por Posición</SelectItem>
							<SelectItem value="code">Ordenar por Código</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<label className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={filterEmpty}
						onChange={(e) => setFilterEmpty(e.target.checked)}
						className="rounded border-gray-300"
					/>
					<span className="text-sm">Ocultar puntos vacíos</span>
				</label>
			</div>

			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Posición</TableHead>
							<TableHead>Coordenadas (cm)</TableHead>
							<TableHead>Código de Producto</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPoints.map((point) => (
							<TableRow key={point.index}>
								<TableCell>
									({point.col}, {point.row})
								</TableCell>
								<TableCell>
									x: {point.x}, y: {point.y}
								</TableCell>
								<TableCell>
									<Input
										value={point.code}
										onChange={(e) =>
											handleCodeChange(point.index, e.target.value)
										}
										placeholder="Ingrese código"
										className="w-full"
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="text-sm text-gray-500">
				Total de puntos: {points.length} | Con código: {points.filter((p) => p.code).length}{' '}
				| Vacíos: {points.filter((p) => !p.code).length}
			</div>
		</div>
	);
};

export default ProductCodeTable;
