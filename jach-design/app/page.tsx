'use client';

import { useState } from 'react';
import { ExhibitionForm } from '@/components/exhibition-form';
import { ExhibitionPreview } from '@/components/exhibition-preview';
import { PDFGenerator } from '@/components/pdf-generator';
import { ExhibitionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
	const [exhibitionData, setExhibitionData] = useState<ExhibitionData | null>(null);
	const [showWelcome, setShowWelcome] = useState(true);

	const handleFormSubmit = (data: ExhibitionData) => {
		setExhibitionData(data);
	};

	const handleBegin = () => {
		setShowWelcome(false);
	};

	return (
		<main className="container mx-auto p-4">
			<AnimatePresence>
				{showWelcome ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex flex-col items-center justify-center min-h-screen">
						<h1 className="text-4xl font-bold text-center mb-6">
							Bienvenido a JACH Diseño de Exhibición
						</h1>
						<p className="text-xl text-center mb-8">
							Diseña tu exhibición de manera rápida y eficiente con nuestra
							herramienta intuitiva.
						</p>
						<Button onClick={handleBegin} size="lg">
							Comenzar
						</Button>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-8">
						<h1 className="text-3xl font-bold text-center mb-6">
							JACH Diseño de Exhibición
						</h1>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h2 className="text-xl font-semibold mb-4">Formulario de Diseño</h2>
								<ExhibitionForm onSubmitAction={handleFormSubmit} />
							</div>
							<div>
								{exhibitionData && (
									<>
										<h2 className="text-xl font-semibold mb-4">
											Vista Previa 3D
										</h2>
										<ExhibitionPreview data={exhibitionData} />
										<PDFGenerator data={exhibitionData} />
									</>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
