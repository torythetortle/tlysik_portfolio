<script lang="ts">
	import { onMount } from 'svelte';
	import { projects as allProjects, type Project } from '$lib/data/projects';

	let hintVisible = $state(true);
	let hintX = $state(0);
	let hintY = $state(0);
	let stickyVisible = $state(false);
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

	const featuredProjects = [...allProjects]
		.filter((p) => p.featured)
		.sort((a, b) => b.date.localeCompare(a.date));

	let columnCount = $state(3);

	const columns = $derived.by(() => {
		const cols: Project[][] = Array.from({ length: columnCount }, () => []);
		featuredProjects.forEach((project, i) => {
			cols[i % columnCount].push(project);
		});
		return cols;
	});

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function formatDate(dateStr: string): string {
		const [year, month] = dateStr.split('-').map(Number);
		return `${monthNames[month - 1]} ${year}`;
	}

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
						if (!aLocked) { a.x -= nx * overlap; a.y -= ny * overlap; }
						if (!bLocked) { b.x += nx * overlap; b.y += ny * overlap; }
						const dvx = a.vx - b.vx;
						const dvy = a.vy - b.vy;
						const dot = dvx * nx + dvy * ny;
						if (dot > 0) {
							if (!aLocked) { a.vx -= dot * nx; a.vy -= dot * ny; }
							if (!bLocked) { b.vx += dot * nx; b.vy += dot * ny; }
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
				if (hex.x < hex.size) { hex.x = hex.size; hex.vx = Math.abs(hex.vx) * 0.85; }
				if (hex.x > canvas.width - hex.size) { hex.x = canvas.width - hex.size; hex.vx = -Math.abs(hex.vx) * 0.85; }
				if (hex.y < hex.size) { hex.y = hex.size; hex.vy = Math.abs(hex.vy) * 0.85; }
				if (hex.y > canvas.height - hex.size) { hex.y = canvas.height - hex.size; hex.vy = -Math.abs(hex.vy) * 0.85; }
			}
			resolveCollisions();
			for (const hex of hexagons) { if (hex !== dragging) drawHexagon(hex); }
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
				pointerVel = { vx: ((x - lastPointer.x) / dt) * 16, vy: ((y - lastPointer.y) / dt) * 16 };
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

		window.addEventListener('resize', () => { resize(); createHexagons(); });
		canvas.addEventListener('pointerdown', onPointerDown);
		canvas.addEventListener('pointermove', onPointerMove);
		canvas.addEventListener('pointerup', onPointerUp);
		canvas.addEventListener('pointercancel', onPointerUp);

		// column count for portfolio grid
		const desktopQuery = window.matchMedia('(min-width: 1025px)');
		const tabletQuery = window.matchMedia('(min-width: 641px) and (max-width: 1024px)');
		function updateColumns() {
			if (desktopQuery.matches) columnCount = 3;
			else if (tabletQuery.matches) columnCount = 2;
			else columnCount = 1;
		}
		updateColumns();
		desktopQuery.addEventListener('change', updateColumns);
		tabletQuery.addEventListener('change', updateColumns);

		// sticky nav: show after hero leaves viewport
		const heroEl = document.querySelector('.hero');
		const observer = new IntersectionObserver(
			([entry]) => { stickyVisible = !entry.isIntersecting; },
			{ threshold: 0 }
		);
		if (heroEl) observer.observe(heroEl);

		return () => {
			cancelAnimationFrame(animationId);
			desktopQuery.removeEventListener('change', updateColumns);
			tabletQuery.removeEventListener('change', updateColumns);
			observer.disconnect();
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

<!-- fixed canvas background -->
<canvas bind:this={canvas} class="hexagon-canvas" style="pointer-events: {stickyVisible ? 'none' : 'auto'}" aria-hidden="true"></canvas>

<!-- sticky nav (appears after scrolling past hero) -->
{#if stickyVisible}
	<header class="sticky-nav" aria-label="Site navigation">
		<div class="sticky-inner">
			<a href="#hero" class="sticky-name">Tory Lysik</a>
			<nav class="sticky-links">
				<a href="#about">About</a>
				<svg viewBox="-24 -24 48 48" width="14" height="14" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="#portfolio">Portfolio</a>
				<svg viewBox="-24 -24 48 48" width="14" height="14" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="/illustrations">Illustrations</a>
				<svg viewBox="-24 -24 48 48" width="14" height="14" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="/resume">Resume</a>
				<svg viewBox="-24 -24 48 48" width="14" height="14" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="#contact">Contact</a>
			</nav>
		</div>
	</header>
{/if}

<!-- drag hint (positioned in viewport space) -->
{#if hintVisible && !stickyVisible}
	<div class="drag-hint-wrap" style="transform: translate({hintX}px, {hintY}px);" aria-hidden="true">
		<div class="drag-hint">drag us</div>
	</div>
{/if}

<div class="home">
	<!-- HERO -->
	<section class="hero" id="hero">
		<div class="hero-content">
			<svg class="hex-glow" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<filter id="hex-blur" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="12" />
					</filter>
				</defs>
				<polygon points="100,12 183,58 183,142 100,188 17,142 17,58" fill="var(--color-bg)" filter="url(#hex-blur)" />
			</svg>
			<h1 class="name">Tory Lysik</h1>
			<p class="tagline">Data and graphics journalist</p>
			<nav class="hero-nav" aria-label="Primary">
				<a href="#about">About</a>
				<svg class="nav-hex" viewBox="-24 -24 48 48" width="20" height="20" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="#portfolio">Portfolio</a>
				<svg class="nav-hex" viewBox="-24 -24 48 48" width="20" height="20" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="/illustrations">Illustrations</a>
				<svg class="nav-hex" viewBox="-24 -24 48 48" width="20" height="20" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="/resume">Resume</a>
				<svg class="nav-hex" viewBox="-24 -24 48 48" width="20" height="20" aria-hidden="true"><polygon points={hexPoints(22)} fill="currentColor" /></svg>
				<a href="#contact">Contact</a>
			</nav>
			<div class="hero-socials">
				<a href="https://github.com/torythetortle" target="_blank" rel="noopener noreferrer">GitHub</a>
				<span class="social-dot" aria-hidden="true">·</span>
				<a href="https://www.linkedin.com/in/tory-lysik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<span class="social-dot" aria-hidden="true">·</span>
				<a href="https://x.com/tblysik" target="_blank" rel="noopener noreferrer">X</a>
				<span class="social-dot" aria-hidden="true">·</span>
				<a href="https://bsky.app/profile/tlysik.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
			</div>
		</div>
		<div class="scroll-cue" aria-hidden="true">scroll ↓</div>
	</section>

	<!-- ABOUT -->
	<section id="about" class="content-section">
		<div class="container">
			<h2 class="section-heading">About</h2>
			<div class="bio">
				<p>I'm a data and graphics journalist and web developer based in New York City.</p>
				<p>
					Currently, I am a reporter at the Tow Center for Digital Journalism. I am passionate about using data and graphics to uncover the stories that impact lives and build a better world. I love speaking with real human beings, making order from chaos, and figuring out seemingly unsolvable problems. I also care deeply about accessibility — taking insanely complex topics and critical information and making it clear and understandable.
				</p>
				<p>
					My career has sometimes followed a bit of a zigzag path. I've worked at outlets including <a href="https://www.axios.com/results?q=tory%20lysik&sort=2" target="_blank" rel="noopener noreferrer">Axios</a>, <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a>, <a href="https://www.themarshallproject.org/" target="_blank" rel="noopener noreferrer">The Marshall Project</a>, the <a href="https://apnews.com/" target="_blank" rel="noopener noreferrer">Associated Press</a>, and others. My work spans from local and national shoeleather reporting to interactive graphics and tools. The work I've been a part of has received numerous awards, and has been cited in congressional testimony and federal legislation.
				</p>
				<p>
					I love what I do. Whether it's diving down rabbit holes in legal documents, filing the perfect FOIA request, or building detailed maps to surface human rights issues, I thrive in the meticulous, detail-heavy work that makes complex stories click — on tight deadlines or over months.
				</p>
				<p>In my free time, I am usually escaping the concrete jungle of NYC for the mountains or trying to become fluent in a fifth language.</p>
			</div>
		</div>
	</section>

	<!-- PORTFOLIO -->
	<section id="portfolio" class="content-section">
		<div class="container wide">
			<div class="section-header">
				<h2 class="section-heading">Portfolio</h2>
				<a href="/portfolio" class="view-all">View all →</a>
			</div>
			<div class="grid">
				{#each columns as columnProjects}
					<div class="column">
						{#each columnProjects as project}
							<article class="project">
								{#if project.thumbnail}
									<a href="/portfolio/{project.slug}" class="project-thumbnail">
										<img src={project.thumbnail} alt="{project.title} — {project.outlet}" loading="lazy" />
									</a>
								{/if}
								<div class="project-content">
									<a href="/portfolio/{project.slug}" class="project-title">{project.title}</a>
									<span class="project-outlet">{project.outlet} · {formatDate(project.date)}</span>
									{#if project.tags.length > 0}
										<p class="project-tags">{project.tags.join(' / ')}</p>
									{/if}
								</div>
							</article>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CONTACT -->
	<section id="contact" class="content-section">
		<div class="container">
			<h2 class="section-heading">Contact</h2>
			<p class="contact-intro">Feel free to reach out by email or on Signal.</p>
			<div class="contact-list">
				<div class="contact-row">
					<span class="label">Email</span>
					<div class="contact-value">
						<a href="mailto:lysiktory@gmail.com">lysiktory@gmail.com</a>
						<a href="mailto:TL3291@columbia.edu">TL3291@columbia.edu</a>
					</div>
				</div>
				<div class="contact-row">
					<span class="label">Signal</span>
					<span class="contact-value">TBLysik.85</span>
				</div>
			</div>
			<div class="social-links">
				<a href="https://github.com/torythetortle" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href="https://www.linkedin.com/in/tory-lysik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href="https://x.com/tblysik" target="_blank" rel="noopener noreferrer">X</a>
				<a href="https://bsky.app/profile/tlysik.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
			</div>
		</div>
	</section>
</div>

<style>
	/* --- canvas --- */
	.hexagon-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		touch-action: pan-y;
	}

	/* --- drag hint --- */
	.drag-hint-wrap {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
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
		background: rgba(245, 245, 245, 0.88);
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
		background: rgba(245, 245, 245, 0.88);
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
	}

	@keyframes drag-pulse {
		0%, 100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
		50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
	}

	/* --- sticky nav --- */
	.sticky-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-border);
		animation: slide-down 0.2s ease;
	}

	@keyframes slide-down {
		from { transform: translateY(-100%); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.sticky-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-xl);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-lg);
		min-height: 52px;
	}

	.sticky-name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-bright);
		text-decoration: none;
		white-space: nowrap;
		-webkit-text-stroke: 0.3px currentColor;
	}

	.sticky-links {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.sticky-links a {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--transition-base);
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.sticky-links a:hover {
		color: var(--color-accent);
	}

	.sticky-links svg {
		color: var(--color-accent);
		opacity: 0.7;
		flex-shrink: 0;
	}

	/* --- home wrapper --- */
	.home {
		position: relative;
		z-index: 1;
		pointer-events: none;
	}

	/* --- hero --- */
	.hero {
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		pointer-events: none;
	}

	.hero-content {
		text-align: center;
		padding: var(--space-xl) var(--space-2xl);
		pointer-events: none;
		position: relative;
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
		-webkit-text-stroke: 0.4px currentColor;
	}

	.tagline {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--color-accent);
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.hero-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem 0.75rem;
		margin: var(--space-md) 0;
		pointer-events: auto;
	}

	.hero-nav a {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		transition: color var(--transition-base);
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.hero-nav a:hover {
		color: var(--color-text-bright);
	}

	.nav-hex {
		color: var(--color-accent);
		opacity: 0.85;
		flex-shrink: 0;
	}

	.hero-socials {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.375rem 0.75rem;
		margin-top: var(--space-sm);
		pointer-events: auto;
	}

	.hero-socials a {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		transition: color var(--transition-base);
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.hero-socials a:hover {
		color: var(--color-accent);
	}

	.social-dot {
		color: var(--color-border);
		font-size: 1rem;
		line-height: 1;
	}

	.scroll-cue {
		position: absolute;
		bottom: 2rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-text-bright);
		font-weight: 700;
		animation: fade-bob 2.5s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes fade-bob {
		0%, 100% { opacity: 0.5; transform: translateY(0); }
		50% { opacity: 1; transform: translateY(4px); }
	}

	/* --- content sections --- */
	.content-section {
		background: rgba(255, 255, 255, 0.97);
		position: relative;
		padding: var(--space-2xl) 0;
		pointer-events: auto;
	}

	.content-section + .content-section {
		border-top: 1px solid var(--color-border);
	}

	.section-heading {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-bright);
		margin-bottom: var(--space-xl);
		-webkit-text-stroke: 0.3px currentColor;
	}

	/* --- about --- */
	.bio p {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: var(--color-text);
	}

	.bio p:last-child {
		margin-bottom: 0;
	}

	.bio a {
		font-weight: 700;
		color: var(--color-accent);
	}

	/* --- portfolio --- */
	.section-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-xl);
	}

	.section-header .section-heading {
		margin-bottom: 0;
	}

	.view-all {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-accent);
		text-decoration: none;
		transition: color var(--transition-base);
	}

	.view-all:hover {
		color: var(--color-accent-hover);
	}

	.container.wide {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-xl);
	}

	.grid {
		display: flex;
		gap: var(--space-xl);
		align-items: flex-start;
	}

	.column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		min-width: 0;
	}

	.project {
		display: flex;
		flex-direction: column;
	}

	.project-thumbnail {
		display: block;
		overflow: hidden;
		margin-bottom: var(--space-sm);
	}

	.project-thumbnail img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
		opacity: 0.88;
		transition: opacity var(--transition-base);
	}

	.project-thumbnail:hover img {
		opacity: 1;
	}

	.project-title {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--color-text-bright);
		line-height: 1.4;
		text-decoration: none;
		display: block;
		padding: 0.375rem 0 0.25rem;
		transition: color var(--transition-base);
	}

	.project-title:hover {
		color: var(--color-accent);
	}

	.project-outlet {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		display: block;
		margin-bottom: var(--space-xs);
	}

	.project-tags {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* --- contact --- */
	.contact-intro {
		font-size: 1rem;
		color: var(--color-text);
		margin-bottom: var(--space-xl);
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-xl);
	}

	.contact-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-lg);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		min-width: 4.5rem;
		flex-shrink: 0;
		-webkit-text-stroke: 0.3px currentColor;
	}

	.contact-value {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-bright);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-md);
	}

	.contact-value a {
		color: var(--color-text-bright);
		text-decoration: none;
		border-bottom: 1px solid var(--color-border);
		transition: color var(--transition-base), border-color var(--transition-base);
		word-break: break-all;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.contact-value a:hover {
		color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.social-links {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.social-links a {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-bright);
		text-decoration: none;
		transition: color var(--transition-base);
		-webkit-text-stroke: 0.3px currentColor;
	}

	.social-links a:hover {
		color: var(--color-accent);
	}

	/* --- responsive --- */
	@media (max-width: 1024px) {
		.grid { gap: var(--space-lg); }
	}

	@media (max-width: 720px) {
		.name { font-size: 2.25rem; }
		.tagline { font-size: 0.875rem; }
		.hero-content { padding: var(--space-lg) var(--space-md); }
	}

	@media (max-width: 640px) {
		.grid { flex-direction: column; }
		.sticky-inner { padding: 0.625rem var(--space-md); }
		.sticky-links svg { display: none; }
		.sticky-links { gap: 0.5rem; font-size: 0.75rem; }
		.container.wide { padding: 0 var(--space-md); }
	}

	@media (max-width: 480px) {
		.name { font-size: 1.75rem; }
		.hero-nav { gap: 0.5rem; }
		.hero-nav a { font-size: 0.8125rem; }
		.nav-hex { display: none; }
		.contact-row { flex-direction: column; gap: var(--space-xs); }
		.sticky-links { gap: 0.5rem; font-size: 0.7rem; }
		.sticky-links svg { display: none; }
		.sticky-inner { padding: 0.5rem var(--space-sm); gap: var(--space-sm); }
		.sticky-name { font-size: 0.9rem; }
		.container.wide { padding: 0 var(--space-sm); }
		.section-header { flex-direction: column; gap: var(--space-xs); align-items: flex-start; }
		.social-links { gap: var(--space-sm); }
		.bio p { font-size: 1rem; line-height: 1.7; }
		.section-heading { font-size: 1.375rem; }
	}
</style>
