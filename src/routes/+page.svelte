<script lang="ts">
	import { onMount } from 'svelte';

	let hintVisible = $state(true);
	let hintX = $state(0);
	let hintY = $state(0);

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
	}

	const palette: [number, number, number][] = [
		[92, 191, 166],   // #5cbfa6
		[107, 210, 148],  // #6bd294
		[102, 225, 110],  // #66e16e
		[37, 161, 142],   // #25a18e
		[0, 165, 207],    // #00a5cf
		[23, 158, 186],   // #179eba
		[35, 110, 164],   // #236ea4
		[46, 151, 165]    // #2e97a5
	];

	function pickColor(): [number, number, number] {
		return palette[Math.floor(Math.random() * palette.length)];
	}

	let canvas: HTMLCanvasElement;

	function hexPoints(size: number): string {
		const pts: string[] = [];
		for (let i = 0; i < 6; i++) {
			const angle = (Math.PI / 3) * i - Math.PI / 2;
			pts.push(`${size * Math.cos(angle)},${size * Math.sin(angle)}`);
		}
		return pts.join(' ');
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		let hexagons: Hexagon[] = [];
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let dragging: Hexagon | null = null;
		let lastPointer: { x: number; y: number; t: number } | null = null;
		let pointerVel: { vx: number; vy: number } = { vx: 0, vy: 0 };
		let hintTarget: Hexagon | null = null;

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function createHexagons() {
			hexagons = [];
			const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 22000));
			for (let i = 0; i < count; i++) {
				hexagons.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: 22 + Math.random() * 40,
					rotation: Math.random() * Math.PI * 2,
					rotationSpeed: (Math.random() - 0.5) * 0.002,
					vx: (Math.random() - 0.5) * 0.15,
					vy: (Math.random() - 0.5) * 0.15,
					opacity: 0.25 + Math.random() * 0.28,
					lineWidth: 1.1 + Math.random() * 0.7,
					hatched: Math.random() < 0.3,
					color: pickColor()
				});
			}

			// pick a medium-large hex away from center for the "drag us" hint
			const cx = canvas.width / 2;
			const cy = canvas.height / 2;
			const candidates = hexagons
				.filter((h) => h.size > 35 && Math.hypot(h.x - cx, h.y - cy) > 250)
				.sort((a, b) => b.size - a.size);
			hintTarget = candidates[0] ?? hexagons[0];
		}

		function hexPath(size: number) {
			ctx!.beginPath();
			for (let i = 0; i < 6; i++) {
				const angle = (Math.PI / 3) * i;
				const px = size * Math.cos(angle);
				const py = size * Math.sin(angle);
				if (i === 0) ctx!.moveTo(px, py);
				else ctx!.lineTo(px, py);
			}
			ctx!.closePath();
		}

		function drawHexagon(hex: Hexagon) {
			const [r, g, b] = hex.color;
			ctx!.save();
			ctx!.translate(hex.x, hex.y);
			ctx!.rotate(hex.rotation);

			hexPath(hex.size);
			ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.opacity})`;
			ctx!.lineWidth = hex.lineWidth;
			ctx!.stroke();

			if (hex.hatched) {
				ctx!.save();
				hexPath(hex.size - hex.lineWidth);
				ctx!.clip();
				ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${hex.opacity * 0.7})`;
				ctx!.lineWidth = hex.lineWidth * 0.55;
				const step = Math.max(1.6, hex.size * 0.09);
				for (let x = -hex.size; x <= hex.size; x += step) {
					ctx!.beginPath();
					ctx!.moveTo(x, -hex.size);
					ctx!.lineTo(x, hex.size);
					ctx!.stroke();
				}
				ctx!.restore();
			}

			ctx!.restore();
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

						const aLocked = dragging === a;
						const bLocked = dragging === b;
						if (!aLocked) {
							a.x -= nx * overlap;
							a.y -= ny * overlap;
						}
						if (!bLocked) {
							b.x += nx * overlap;
							b.y += ny * overlap;
						}

						const dvx = a.vx - b.vx;
						const dvy = a.vy - b.vy;
						const dot = dvx * nx + dvy * ny;
						if (dot > 0) {
							if (!aLocked) {
								a.vx -= dot * nx;
								a.vy -= dot * ny;
							}
							if (!bLocked) {
								b.vx += dot * nx;
								b.vy += dot * ny;
							}
						}
					}
				}
			}
		}

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const hex of hexagons) {
				if (hex === dragging) continue;
				hex.x += hex.vx;
				hex.y += hex.vy;
				hex.rotation += hex.rotationSpeed;
				hex.vx *= 0.995;
				hex.vy *= 0.995;

				if (hex.x < hex.size) {
					hex.x = hex.size;
					hex.vx = Math.abs(hex.vx) * 0.85;
				}
				if (hex.x > canvas.width - hex.size) {
					hex.x = canvas.width - hex.size;
					hex.vx = -Math.abs(hex.vx) * 0.85;
				}
				if (hex.y < hex.size) {
					hex.y = hex.size;
					hex.vy = Math.abs(hex.vy) * 0.85;
				}
				if (hex.y > canvas.height - hex.size) {
					hex.y = canvas.height - hex.size;
					hex.vy = -Math.abs(hex.vy) * 0.85;
				}
			}

			resolveCollisions();

			// draw non-dragging first, dragging on top
			for (const hex of hexagons) {
				if (hex !== dragging) drawHexagon(hex);
			}
			if (dragging) drawHexagon(dragging);

			if (hintVisible && hintTarget) {
				hintX = hintTarget.x;
				hintY = hintTarget.y - hintTarget.size - 14;
			}

			animationId = requestAnimationFrame(animate);
		}

		function hitTest(x: number, y: number): Hexagon | null {
			for (let i = hexagons.length - 1; i >= 0; i--) {
				const h = hexagons[i];
				const dx = x - h.x;
				const dy = y - h.y;
				if (dx * dx + dy * dy < h.size * h.size) return h;
			}
			return null;
		}

		function onPointerDown(e: PointerEvent) {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const hit = hitTest(x, y);
			if (hit) {
				dragging = hit;
				hit.vx = 0;
				hit.vy = 0;
				lastPointer = { x, y, t: performance.now() };
				pointerVel = { vx: 0, vy: 0 };
				canvas.setPointerCapture(e.pointerId);
				canvas.style.cursor = 'grabbing';
				hintVisible = false;
			}
		}

		function onPointerMove(e: PointerEvent) {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			if (!dragging) {
				canvas.style.cursor = hitTest(x, y) ? 'grab' : 'default';
				return;
			}

			const now = performance.now();
			if (lastPointer) {
				const dt = Math.max(1, now - lastPointer.t);
				pointerVel = {
					vx: ((x - lastPointer.x) / dt) * 16,
					vy: ((y - lastPointer.y) / dt) * 16
				};
			}
			dragging.x = x;
			dragging.y = y;
			lastPointer = { x, y, t: now };
		}

		function onPointerUp(e: PointerEvent) {
			if (!dragging) return;
			dragging.vx = pointerVel.vx;
			dragging.vy = pointerVel.vy;
			dragging = null;
			lastPointer = null;
			canvas.releasePointerCapture(e.pointerId);
			canvas.style.cursor = 'default';
		}

		resize();
		createHexagons();
		if (!prefersReducedMotion) animate();
		else for (const h of hexagons) drawHexagon(h);

		window.addEventListener('resize', () => {
			resize();
			createHexagons();
		});
		canvas.addEventListener('pointerdown', onPointerDown);
		canvas.addEventListener('pointermove', onPointerMove);
		canvas.addEventListener('pointerup', onPointerUp);
		canvas.addEventListener('pointercancel', onPointerUp);

		return () => {
			cancelAnimationFrame(animationId);
		};
	});
</script>

<svelte:head>
	<title>Tory Lysik - Journalist</title>
	<meta name="description" content="Portfolio of Tory Lysik. Data and graphics journalist." />
	<link rel="canonical" href="https://tlysik.com/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/" />
	<meta property="og:title" content="Tory Lysik - Journalist" />
	<meta property="og:description" content="Data and graphics journalist." />
	<meta property="og:image" content="https://tlysik.com/images/headshot.webp" />
	<meta property="og:site_name" content="Tory Lysik" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tory Lysik - Journalist" />
	<meta name="twitter:description" content="Data and graphics journalist." />
	<meta name="twitter:image" content="https://tlysik.com/images/headshot.webp" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Tory Lysik',
		url: 'https://tlysik.com',
		jobTitle: 'Data and Graphics Journalist',
		worksFor: { '@type': 'Organization', name: 'Tow Center for Digital Journalism' },
		sameAs: ['https://github.com/torythetortle'],
		image: 'https://tlysik.com/images/headshot.webp',
		description: 'Data and graphics journalist.'
	})}</script>`}
</svelte:head>

<div class="home">
	<canvas bind:this={canvas} class="hexagon-canvas"></canvas>

	<div class="center-label">
		<svg class="hex-glow" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<filter id="hex-blur" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<polygon
				points="100,12 183,58 183,142 100,188 17,142 17,58"
				fill="var(--color-bg)"
				filter="url(#hex-blur)"
			/>
		</svg>
		<h1 class="name">Tory Lysik</h1>
		<p class="tagline">Data and graphics journalist</p>
		<nav class="center-nav" aria-label="Primary">
			{#each ['/about', '/portfolio', '/illustrations', '/resume', '/contact'] as path, idx}
				<a href={path}>{['About', 'Portfolio', 'Illustrations', 'Resume', 'Contact'][idx]}</a>
				{#if idx < 4}
					<svg class="nav-hex" viewBox="-24 -24 48 48" width="22" height="22" aria-hidden="true">
						<polygon points={hexPoints(22)} fill="currentColor" />
					</svg>
				{/if}
			{/each}
		</nav>
	</div>

	{#if hintVisible}
		<div class="drag-hint-wrap" style="transform: translate({hintX}px, {hintY}px);" aria-hidden="true">
			<div class="drag-hint">drag us</div>
		</div>
	{/if}
</div>

<style>
	.home {
		position: fixed;
		inset: 0;
	}

	.hexagon-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		touch-action: none;
	}

	.center-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		text-align: center;
		padding: var(--space-xl) var(--space-2xl);
		pointer-events: none;
		min-width: 680px;
	}

	.hex-glow {
		position: absolute;
		inset: -40px -40px;
		width: calc(100% + 80px);
		height: calc(100% + 80px);
		z-index: -1;
		pointer-events: none;
	}

	.name {
		font-family: var(--font-display);
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--color-text-bright);
		margin: 0 0 0.75rem;
		letter-spacing: 0.02em;
		line-height: 1.1;
	}

	.tagline {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--color-accent);
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.center-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem 0.75rem;
		margin: var(--space-md) 0;
		pointer-events: auto;
	}

	.center-nav a {
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		transition: color var(--transition-base);
	}

	.center-nav a:hover {
		color: var(--color-text-bright);
	}

	.nav-hex {
		color: var(--color-accent);
		opacity: 0.85;
		flex-shrink: 0;
	}

	.drag-hint-wrap {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		pointer-events: none;
		will-change: transform;
	}

	.drag-hint {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		background: rgba(245, 242, 238, 0.88);
		border: 1px solid var(--color-border);
		padding: 4px 10px;
		border-radius: 4px;
		white-space: nowrap;
		transform: translateX(-50%);
		animation: drag-pulse 1.4s ease-in-out infinite;
		transform-origin: center bottom;
	}

	.drag-hint::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%) rotate(45deg);
		width: 8px;
		height: 8px;
		background: rgba(245, 242, 238, 0.88);
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
	}

	@keyframes drag-pulse {
		0%, 100% {
			opacity: 0.75;
			transform: translateX(-50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translateX(-50%) scale(1.08);
		}
	}

	@media (max-width: 720px) {
		.name {
			font-size: 2.25rem;
		}
		.tagline {
			font-size: 0.875rem;
		}
		.center-label {
			padding: var(--space-lg) var(--space-md);
			min-width: 0;
			width: 92vw;
		}
	}

	@media (max-width: 480px) {
		.name {
			font-size: 1.75rem;
		}
		.center-nav {
			gap: 0.5rem;
		}
		.center-nav a {
			font-size: 0.8125rem;
		}
		.nav-hex {
			display: none;
		}
	}
</style>
