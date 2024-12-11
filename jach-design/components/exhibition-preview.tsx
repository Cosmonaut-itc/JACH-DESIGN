'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ExhibitionData } from '@/lib/types';

interface ExhibitionPreviewProps {
	data: ExhibitionData;
}

export function ExhibitionPreview({ data }: ExhibitionPreviewProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mountRef.current) return;

		const { length, height, separation, productCodes } = data;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);

		const camera = new THREE.PerspectiveCamera(
			45,
			mountRef.current.clientWidth / mountRef.current.clientHeight,
			0.1,
			2000,
		);
		camera.position.set(0, 0, Math.max(length, height) * 1.5);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
		});
		renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		mountRef.current.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

		// Create exhibition area
		const areaGeometry = new THREE.BoxGeometry(length, height, 1);
		const areaMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
		const areaMesh = new THREE.Mesh(areaGeometry, areaMaterial);
		scene.add(areaMesh);

		// Create base
		const baseGeometry = new THREE.BoxGeometry(length + 20, 20, 40);
		const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x0000aa });
		const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
		baseMesh.position.y = -height / 2 - 10;
		baseMesh.position.z = 15;
		scene.add(baseMesh);

		// Create mounting points with product codes
		const cols = Math.floor(length / separation);
		const rows = Math.floor(height / separation);
		const totalDots = cols * rows;

		const dotGeometry = new THREE.CircleGeometry(2, 32);
		const dotMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			side: THREE.DoubleSide,
		});
		const instancedDots = new THREE.InstancedMesh(dotGeometry, dotMaterial, totalDots);

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (context) {
			context.font = '12px Arial';
			context.fillStyle = 'black';
		}

		let index = 0;
		const matrix = new THREE.Matrix4();
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const x = j * separation - length / 2 + separation / 2;
				const y = height / 2 - (i * separation + separation / 2);
				matrix.setPosition(x, y, 0.6);
				instancedDots.setMatrixAt(index, matrix);

				if (productCodes && productCodes[index]) {
					if (context) {
						canvas.width = 64;
						canvas.height = 32;
						context.clearRect(0, 0, canvas.width, canvas.height);
						context.fillText(productCodes[index], 0, 16);
					}
					const texture = new THREE.CanvasTexture(canvas);
					const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
					const sprite = new THREE.Sprite(spriteMaterial);
					sprite.position.set(x, y, 0.7);
					sprite.scale.set(20, 10, 1);
					scene.add(sprite);
				}

				index++;
			}
		}
		scene.add(instancedDots);

		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();

		const handleResize = () => {
			if (!mountRef.current) return;
			camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			mountRef.current?.removeChild(renderer.domElement);
		};
	}, [data]);

	return (
		<div
			ref={mountRef}
			className="w-full aspect-[4/3] border border-neutral-200 rounded-lg dark:border-neutral-800"
		/>
	);
}
