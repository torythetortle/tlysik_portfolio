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
		hatched: boolean;
		color: [number, number, number];
		wobble: number[];
	}

	const palette: [number, number, number][] = [
		[125, 180, 144],  // brighter sage
		[93, 152, 114],   // mid green
		[237, 220, 233],  // pale lilac
		[220, 198, 212],  // brighter mauve
		[216, 130, 150]   // brighter wine
	];

	function pickColor(): [number, number, number] {
		return palette[Math.floor(Math.random() * palette.length)];
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

		function makeWobble(): number[] {
			return Array.from({ length: 12 }, () => 0);
		}

		function createHexagons() {
			hexagons = [];

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
					hatched: Math.random() < 0.35,
					color: pickColor(),
					wobble: makeWobble()
				});
			}

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
					hatched: Math.random() < 0.25,
					color: pickColor(),
					wobble: makeWobble()
				});
			}
		}

		function hexPath(ctx: CanvasRenderingContext2D, size: number) {
			ctx.beginPath();
			for (let i = 0; i < 6; i++) {
				const angle = (Math.PI / 3) * i;
				const px = size * Math.cos(angle);
				const py = size * Math.sin(angle);
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
		}

		function drawHexagon(ctx: CanvasRenderingContext2D, hex: Hexagon) {
			const [r, g, b] = hex.color;
			ctx.save();
			ctx.translate(hex.x, hex.y);
			ctx.rotate(hex.rotation);

			// clean hexagon outline
			hexPath(ctx, hex.size);
			ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.opacity * 1.3})`;
			ctx.lineWidth = hex.lineWidth;
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.stroke();

			// engraving-style vertical hatching inside, clipped to hexagon
			if (hex.hatched) {
				ctx.save();
				hexPath(ctx, hex.size - hex.lineWidth);
				ctx.clip();

				ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.opacity * 0.85})`;
				ctx.lineWidth = hex.lineWidth * 0.55;
				const step = Math.max(1.6, hex.size * 0.08);
				for (let x = -hex.size; x <= hex.size; x += step) {
					ctx.beginPath();
					ctx.moveTo(x, -hex.size);
					ctx.lineTo(x, hex.size);
					ctx.stroke();
				}
				ctx.restore();
			}

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
						const nx = dx / dist;
						const ny = dy / dist;
						const overlap = (minDist - dist) * 0.5;
						a.x -= nx * overlap;
						a.y -= ny * overlap;
						b.x += nx * overlap;
						b.y += ny * overlap;

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
