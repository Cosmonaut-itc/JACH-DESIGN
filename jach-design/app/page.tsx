'use client';
import ExhibitionDesigner from '@/components/exhibition-designer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Home() {
	const [mostrarFormulario, setMostrarFormulario] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
				<div className="p-6 sm:p-8">
					<h1 className="text-3xl font-bold text-center mb-2">
						Bienvenido a JACH Diseño de Exhibición
					</h1>
					<p className="text-center text-lg text-gray-600 mb-6">
						Acelera tu proceso de diseño de exhibiciones con nuestra herramienta
						intuitiva
					</p>
					{!mostrarFormulario ? (
						<div className="text-center">
							<p className="mb-6 text-gray-700">
								Esta aplicación web te ayuda a diseñar rápidamente exhibiciones
								organizando puntos en un área rectangular. Ingresa las dimensiones
								de tu espacio, y la separación entre puntos para generar tu diseño y
								poder descargarlo en PDF.
							</p>
							<Button size="lg" onClick={() => setMostrarFormulario(true)}>
								Comenzar a Diseñar
							</Button>
						</div>
					) : (
						<div>
							<ExhibitionDesigner />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
