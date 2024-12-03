'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExhibitionData } from '@/lib/types';
import { BufferGeometry, Material, Mesh, Object3D } from 'three';

interface ExhibitionPreviewProps {
	data: ExhibitionData;
}

export function ExhibitionPreview({ data }: ExhibitionPreviewProps) {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const animationFrameIdRef = useRef<number>();

	const [size, setSize] = useState({ width: 0, height: 0 });

	// Memoized size update handler
	const updateSize = useCallback(() => {
		if (mountRef.current) {
			const width = mountRef.current.clientWidth;
			setSize({
				width,
				height: width * 0.75,
			});
		}
	}, []);

	// Handle resize events
	useEffect(() => {
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, [updateSize]);

	// Clean up Three.js resources
	const cleanup = useCallback(() => {
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}

		if (rendererRef.current && mountRef.current) {
			mountRef.current.removeChild(rendererRef.current.domElement);
		}

		if (controlsRef.current) {
			controlsRef.current.dispose();
		}

		// Clean up Three.js resources
		sceneRef.current?.traverse((object: Object3D) => {
			// First, check if it's a Mesh
			if (object instanceof Mesh) {
				// At this point, TypeScript knows object is a Mesh
				const mesh = object as Mesh<BufferGeometry, Material | Material[]>;

				// Now we can safely dispose of the geometry
				if (mesh.geometry) {
					mesh.geometry.dispose();
				}

				// Handle both single materials and material arrays
				if (Array.isArray(mesh.material)) {
					// If it's an array of materials
					mesh.material.forEach((material) => material.dispose());
				} else if (mesh.material) {
					// If it's a single material
					mesh.material.dispose();
				}
			}
		});

		if (rendererRef.current) {
			rendererRef.current.dispose();
			rendererRef.current = null;
		}

		sceneRef.current = null;
		cameraRef.current = null;
		controlsRef.current = null;
	}, []);

	// Main scene setup and update effect
	useEffect(() => {
		if (!mountRef.current || size.width === 0 || size.height === 0) return;

		// Clean up existing scene
		cleanup();

		const { length, height, separation } = data;

		// Scene initialization
		sceneRef.current = new THREE.Scene();
		sceneRef.current.background = new THREE.Color(0xffffff);

		// Camera initialization
		cameraRef.current = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 2000);
		cameraRef.current.position.set(0, 0, Math.max(length, height) * 1.5);

		// Renderer initialization
		rendererRef.current = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
		});
		rendererRef.current.setSize(size.width, size.height);
		rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		mountRef.current.appendChild(rendererRef.current.domElement);

		// Controls initialization
		if (cameraRef.current && rendererRef.current) {
			controlsRef.current = new OrbitControls(
				cameraRef.current,
				rendererRef.current.domElement,
			);
			controlsRef.current.enableDamping = true;
			controlsRef.current.dampingFactor = 0.05;
		}

		// Create geometries and materials
		const areaGeometry = new THREE.BoxGeometry(length, height, 1);
		const areaMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
		const areaMesh = new THREE.Mesh(areaGeometry, areaMaterial);
		sceneRef.current.add(areaMesh);

		const baseGeometry = new THREE.BoxGeometry(length + 20, 20, 40);
		const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x0000aa });
		const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
		baseMesh.position.y = -height / 2 - 10;
		baseMesh.position.z = 15;
		sceneRef.current.add(baseMesh);

		// Create dots using instanced mesh for better performance
		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);
		const totalDots = cols * rows;

		const dotGeometry = new THREE.CircleGeometry(2, 32);
		const dotMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			side: THREE.DoubleSide,
		});
		const instancedDots = new THREE.InstancedMesh(dotGeometry, dotMaterial, totalDots);

		let index = 0;
		const matrix = new THREE.Matrix4();
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				matrix.setPosition(
					j * separation - length / 2 + separation / 2,
					height / 2 - (i * separation + separation / 2),
					0.6,
				);
				instancedDots.setMatrixAt(index, matrix);
				index++;
			}
		}
		sceneRef.current.add(instancedDots);

		// Animation loop
		const animate = () => {
			animationFrameIdRef.current = requestAnimationFrame(animate);
			if (controlsRef.current) controlsRef.current.update();
			if (rendererRef.current && sceneRef.current && cameraRef.current) {
				rendererRef.current.render(sceneRef.current, cameraRef.current);
			}
		};
		animate();

		// Cleanup on unmount or data change
		return cleanup;
	}, [data.length, data.height, data.separation, size.width, size.height, cleanup]);

	return (
		<div
			ref={mountRef}
			className="w-full aspect-[4/3] border border-neutral-200 rounded-lg dark:border-neutral-800"
		/>
	);
}
