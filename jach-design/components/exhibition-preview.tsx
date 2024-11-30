'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { ExhibitionData } from '@/lib/types';

interface ExhibitionPreviewProps {
	data: ExhibitionData;
}

export function ExhibitionPreview({ data }: ExhibitionPreviewProps) {
	// Reference to the mounting div and state for component size
	const mountRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	// Effect to handle component resizing
	useEffect(() => {
		const updateSize = () => {
			if (mountRef.current) {
				setSize({
					width: mountRef.current.clientWidth,
					height: mountRef.current.clientWidth * 0.75, // Maintaining 4:3 aspect ratio
				});
			}
		};

		// Add resize listener and perform initial size calculation
		window.addEventListener('resize', updateSize);
		updateSize();

		// Cleanup resize listener
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	// Main Three.js setup and rendering effect
	useEffect(() => {
		// Don't proceed if mount point isn't ready or size isn't set
		if (!mountRef.current || size.width === 0 || size.height === 0) return;

		// Destructure exhibition data parameters
		const { length, height, dots, separation } = data;

		try {
			// Check WebGL availability
			if (!WEBGL.isWebGL2Available()) {
				const warning = WEBGL.getWebGL2ErrorMessage();
				mountRef.current.appendChild(warning);
				return;
			}

			// Scene setup
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0xffffff);

			// Camera setup with proper aspect ratio
			const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 2000);

			// Renderer initialization
			const renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(size.width, size.height);
			mountRef.current.innerHTML = '';
			mountRef.current.appendChild(renderer.domElement);

			// Orbit controls setup
			const controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;

			// Create main exhibition area
			const areaGeometry = new THREE.BoxGeometry(length, height, 1);
			const areaMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
			const areaMesh = new THREE.Mesh(areaGeometry, areaMaterial);
			scene.add(areaMesh);

			// Add base platform
			const baseGeometry = new THREE.BoxGeometry(length + 20, 20, 40);
			const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x0000aa });
			const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
			baseMesh.position.y = -height / 2 - 10;
			baseMesh.position.z = 15;
			scene.add(baseMesh);

			// Create and place dots
			const dotGeometry = new THREE.CircleGeometry(2, 32);
			const dotMaterial = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				side: THREE.DoubleSide,
			});

			const cols = Math.floor(length / separation);
			const rows = Math.floor(height / separation);

			// Store all created dots for potential future interaction
			const dotMeshes: THREE.Mesh[] = [];

			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (i * cols + j >= dots) break;

					const dot = new THREE.Mesh(dotGeometry, dotMaterial);
					dot.position.set(
						j * separation - length / 2 + separation / 2,
						height / 2 - (i * separation + separation / 2),
						0.6,
					);
					scene.add(dot);
					dotMeshes.push(dot);
				}
			}

			// Position camera to view entire exhibition
			camera.position.set(0, 0, Math.max(length, height) * 1.5);
			controls.update();

			// Animation loop setup
			let animationFrameId: number;
			const animate = () => {
				animationFrameId = requestAnimationFrame(animate);
				controls.update();
				renderer.render(scene, camera);
			};
			animate();

			// Comprehensive cleanup
			return () => {
				// Cancel animation frame
				cancelAnimationFrame(animationFrameId);

				// Dispose of geometries
				areaGeometry.dispose();
				baseGeometry.dispose();
				dotGeometry.dispose();

				// Dispose of materials
				areaMaterial.dispose();
				baseMaterial.dispose();
				dotMaterial.dispose();

				// Dispose of meshes
				dotMeshes.forEach((dot) => {
					dot.geometry.dispose();
					if (dot.material instanceof THREE.Material) {
						dot.material.dispose();
					}
				});

				// Dispose of controls
				controls.dispose();

				// Dispose of renderer
				renderer.dispose();

				// Clean up mount point
				if (mountRef.current) {
					mountRef.current.innerHTML = '';
				}
			};
		} catch (error) {
			console.error('Error initializing Three.js:', error);
			if (mountRef.current) {
				mountRef.current.innerHTML = 'Error initializing 3D preview';
			}
		}
	}, [data, size]);

	// Component render
	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<h2 className="text-xl font-semibold mb-4">Vista Previa 3D</h2>
			<div
				ref={mountRef}
				className="w-full aspect-[4/3] border border-neutral-200 rounded-lg dark:border-neutral-800"
			/>
		</div>
	);
}
