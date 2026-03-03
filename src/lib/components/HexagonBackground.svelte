<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	interface Hexagon {
		x: number;
		y: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
		vx: number;
		vy: number;
		opacity: number;
		lineWidth: number;
		filled: boolean;
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		let hexagons: Hexagon[] = [];

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function createHexagons() {
			hexagons = [];

			// Deep layer: medium, faint, slow — atmospheric depth
			const deepCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 40000));
			for (let i = 0; i < deepCount; i++) {
				hexagons.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: 25 + Math.random() * 35,
					rotation: Math.random() * Math.PI * 2,
					rotationSpeed: (Math.random() - 0.5) * 0.001,
					vx: (Math.random() - 0.5) * 0.1,
					vy: (Math.random() - 0.5) * 0.1,
					opacity: 0.14 + Math.random() * 0.08,
					lineWidth: 1,
					filled: Math.random() < 0.25
				});
			}

			// Near layer: small, brighter, faster — visible accents
			const nearCount = Math.min(22, Math.floor((canvas.width * canvas.height) / 55000));
			for (let i = 0; i < nearCount; i++) {
				hexagons.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: 10 + Math.random() * 18,
					rotation: Math.random() * Math.PI * 2,
					rotationSpeed: (Math.random() - 0.5) * 0.003,
					vx: (Math.random() - 0.5) * 0.3,
					vy: (Math.random() - 0.5) * 0.3,
					opacity: 0.15 + Math.random() * 0.1,
					lineWidth: 1.25,
					filled: Math.random() < 0.3
				});
			}
		}

		function drawHexagon(ctx: CanvasRenderingContext2D, hex: Hexagon) {
			ctx.save();
			ctx.translate(hex.x, hex.y);
			ctx.rotate(hex.rotation);
			ctx.beginPath();
			for (let i = 0; i < 6; i++) {
				const angle = (Math.PI / 3) * i;
				const px = hex.size * Math.cos(angle);
				const py = hex.size * Math.sin(angle);
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
			if (hex.filled) {
				ctx.fillStyle = `rgba(196, 168, 224, ${hex.opacity * 0.4})`;
				ctx.fill();
			}
			ctx.strokeStyle = `rgba(196, 168, 224, ${hex.opacity})`;
			ctx.lineWidth = hex.lineWidth;
			ctx.stroke();
			ctx.restore();
		}

		function resolveCollisions() {
			for (let i = 0; i < hexagons.length; i++) {
				for (let j = i + 1; j < hexagons.length; j++) {
					const a = hexagons[i];
					const b = hexagons[j];
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const minDist = a.size + b.size;

					if (dist < minDist && dist > 0) {
						// Push apart
						const nx = dx / dist;
						const ny = dy / dist;
						const overlap = (minDist - dist) * 0.5;
						a.x -= nx * overlap;
						a.y -= ny * overlap;
						b.x += nx * overlap;
						b.y += ny * overlap;

						// Swap velocity components along collision axis
						const dvx = a.vx - b.vx;
						const dvy = a.vy - b.vy;
						const dot = dvx * nx + dvy * ny;
						if (dot > 0) {
							a.vx -= dot * nx;
							a.vy -= dot * ny;
							b.vx += dot * nx;
							b.vy += dot * ny;
						}
					}
				}
			}
		}

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const hex of hexagons) {
				hex.x += hex.vx;
				hex.y += hex.vy;
				hex.rotation += hex.rotationSpeed;

				// Wrap around edges
				if (hex.x < -hex.size) hex.x = canvas.width + hex.size;
				if (hex.x > canvas.width + hex.size) hex.x = -hex.size;
				if (hex.y < -hex.size) hex.y = canvas.height + hex.size;
				if (hex.y > canvas.height + hex.size) hex.y = -hex.size;
			}

			resolveCollisions();

			for (const hex of hexagons) {
				drawHexagon(ctx, hex);
			}

			animationId = requestAnimationFrame(animate);
		}

		resize();
		createHexagons();

		if (!prefersReducedMotion) {
			animate();
		} else {
			// Draw once, static
			for (const hex of hexagons) {
				drawHexagon(ctx, hex);
			}
		}

		window.addEventListener('resize', () => {
			resize();
			createHexagons();
		});

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="hexagon-bg" aria-hidden="true"></canvas>

<style>
	.hexagon-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}
</style>
