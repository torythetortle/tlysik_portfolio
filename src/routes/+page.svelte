<script lang="ts">
	import { onMount } from 'svelte';
	import { projects as allProjects, type Project } from '$lib/data/projects';

	let stickyVisible = $state(false);

	interface SeedItem {
		file: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
	}

	let seeds = $state<SeedItem[]>([]);
	let seedEls: HTMLImageElement[] = [];
	let draggingSeed = $state<number | null>(null);
	let dragOffsetX = 0;
	let dragOffsetY = 0;
	let showDragHint = $state(true);

	function onSeedPointerDown(e: PointerEvent, i: number) {
		dragOffsetX = e.clientX - seeds[i].x;
		dragOffsetY = e.clientY - seeds[i].y;
		seeds[i].vx = 0;
		seeds[i].vy = 0;
		draggingSeed = i;
		showDragHint = false;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function onSeedPointerMove(e: PointerEvent, i: number) {
		if (draggingSeed !== i) return;
		seeds[i].x = e.clientX - dragOffsetX;
		seeds[i].y = e.clientY - dragOffsetY;
		const el = seedEls[i];
		if (el) {
			el.style.left = seeds[i].x + 'px';
			el.style.top = seeds[i].y + 'px';
		}
	}

	function onSeedPointerUp(e: PointerEvent, i: number) {
		if (draggingSeed !== i) return;
		seeds[i].vx = (Math.random() - 0.5) * 0.2;
		seeds[i].vy = (Math.random() - 0.5) * 0.2;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		draggingSeed = null;
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
		const W = () => window.innerWidth;
		const H = () => window.innerHeight;

		seeds = Array.from({ length: 14 }, (_, i) => ({
			file: `/dandis/seed${(i % 4) + 1}.svg`,
			x: 60 + Math.random() * (W() - 120),
			y: 60 + Math.random() * (H() * 0.75),
			vx: (Math.random() - 0.5) * 0.15,
			vy: (Math.random() - 0.5) * 0.15,
			size: 26 + Math.random() * 16,
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 0.15
		}));

		// physics loop — direct DOM writes to avoid Svelte scheduler jank
		let animId: number;

		function tick() {
			animId = requestAnimationFrame(tick);

			const W = window.innerWidth;
			const H = window.innerHeight;

			for (let i = 0; i < seeds.length; i++) {
				if (draggingSeed === i) continue;
				seeds[i].x += seeds[i].vx;
				seeds[i].y += seeds[i].vy;
				seeds[i].rotation += seeds[i].rotationSpeed;

				const s = seeds[i].size;
				if (seeds[i].x < -s * 2) seeds[i].x = W + s;
				else if (seeds[i].x > W + s) seeds[i].x = -s * 2;
				if (seeds[i].y < -s * 2) seeds[i].y = H + s;
				else if (seeds[i].y > H + s) seeds[i].y = -s * 2;
			}

			// collision — center-to-center distance, velocity exchange
			for (let i = 0; i < seeds.length; i++) {
				for (let j = i + 1; j < seeds.length; j++) {
					const cx_i = seeds[i].x + seeds[i].size * 0.5;
					const cy_i = seeds[i].y + seeds[i].size * 0.9;
					const cx_j = seeds[j].x + seeds[j].size * 0.5;
					const cy_j = seeds[j].y + seeds[j].size * 0.9;
					const dx = cx_j - cx_i;
					const dy = cy_j - cy_i;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const minDist = (seeds[i].size + seeds[j].size) * 0.65;
					if (dist < minDist && dist > 0.01) {
						const nx = dx / dist;
						const ny = dy / dist;
						const overlap = (minDist - dist) * 0.5;
						if (draggingSeed !== i) { seeds[i].x -= nx * overlap; seeds[i].y -= ny * overlap; }
						if (draggingSeed !== j) { seeds[j].x += nx * overlap; seeds[j].y += ny * overlap; }
						const dvx = seeds[j].vx - seeds[i].vx;
						const dvy = seeds[j].vy - seeds[i].vy;
						const dvn = dvx * nx + dvy * ny;
						if (dvn < 0) {
							const impulse = dvn * 0.75;
							if (draggingSeed !== i) { seeds[i].vx += nx * impulse; seeds[i].vy += ny * impulse; }
							if (draggingSeed !== j) { seeds[j].vx -= nx * impulse; seeds[j].vy -= ny * impulse; }
						}
					}
				}
			}

			// cap speed
			for (let i = 0; i < seeds.length; i++) {
				if (draggingSeed === i) continue;
				const speed = Math.sqrt(seeds[i].vx ** 2 + seeds[i].vy ** 2);
				if (speed > 0.75) {
					seeds[i].vx = (seeds[i].vx / speed) * 0.75;
					seeds[i].vy = (seeds[i].vy / speed) * 0.75;
				}
			}

			// write to DOM directly — faster than going through Svelte's scheduler
			for (let i = 0; i < seeds.length; i++) {
				const el = seedEls[i];
				if (!el || draggingSeed === i) continue;
				el.style.left = seeds[i].x + 'px';
				el.style.top = seeds[i].y + 'px';
				el.style.transform = `rotate(${seeds[i].rotation}deg)`;
			}
		}

		animId = requestAnimationFrame(tick);

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
			cancelAnimationFrame(animId);
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

<!-- floating seeds + static flowers -->
<div class="scene" aria-hidden="true">
	{#each seeds as seed, i}
		<img
			bind:this={seedEls[i]}
			src={seed.file}
			alt=""
			class="seed"
			class:dragging={draggingSeed === i}
			style="left:{seed.x}px;top:{seed.y}px;width:{seed.size}px;transform:rotate({seed.rotation}deg);"
			onpointerdown={(e) => onSeedPointerDown(e, i)}
			onpointermove={(e) => onSeedPointerMove(e, i)}
			onpointerup={(e) => onSeedPointerUp(e, i)}
			onpointercancel={(e) => onSeedPointerUp(e, i)}
			draggable="false"
		/>
	{/each}
	<img src="/dandis/flower1.svg" alt="" class="flower flower-left" />
	<img src="/dandis/flower2.svg" alt="" class="flower flower-right" />
	{#if showDragHint}
		<div class="drag-hint" aria-hidden="true">
			<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
				<path d="M8 28 Q8 8 28 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
				<polyline points="22,4 28,8 24,14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
			</svg>
			<span>move me</span>
		</div>
	{/if}
</div>

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

<div class="home">
	<!-- HERO -->
	<section class="hero" id="hero">
		<div class="hero-content">
			<svg class="hex-glow" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<filter id="hex-blur" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="3" />
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
				<p>I'm a <strong>data and graphics journalist</strong> and web developer based in <strong>New York City</strong>, currently working as a reporter at the <strong>Tow Center for Digital Journalism</strong> at Columbia University.</p>
				<p>
					I've worked at <a href="https://www.axios.com/results?q=tory%20lysik&sort=2" target="_blank" rel="noopener noreferrer">Axios</a>, <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a>, <a href="https://www.themarshallproject.org/" target="_blank" rel="noopener noreferrer">The Marshall Project</a>, the <a href="https://apnews.com/" target="_blank" rel="noopener noreferrer">Associated Press</a>, and others — spanning local shoeleather reporting to <strong>interactive graphics and data tools</strong>. My work has received numerous awards and has been cited in <strong>congressional testimony and federal legislation</strong>.
				</p>
				<p>
					I care deeply about <strong>accessibility</strong> — making complex, critical information clear and understandable. Whether diving into legal documents, filing FOIA requests, or building maps to surface human rights issues, I thrive in the meticulous, detail-heavy work that makes complex stories click.
				</p>
				<p>In my free time, I'm usually escaping NYC for the mountains or working on becoming fluent in a fifth language.</p>
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
	/* --- scene (seeds + flowers) --- */
	.scene {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.seed {
		position: absolute;
		height: auto;
		opacity: 0.75;
		pointer-events: auto;
		cursor: grab;
		user-select: none;
		touch-action: none;
	}

	.seed.dragging {
		cursor: grabbing;
		z-index: 10;
	}

	.drag-hint {
		position: absolute;
		top: 18%;
		left: 6%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		color: var(--color-accent);
		opacity: 0.7;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		pointer-events: none;
		animation: hint-bob 2.5s ease-in-out infinite;
	}

	@keyframes hint-bob {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(-5px); }
	}

	.flower {
		position: absolute;
		bottom: 0;
		height: auto;
		opacity: 0.95;
		pointer-events: none;
	}

	.flower-left {
		left: 4%;
		width: 280px;
	}

	.flower-right {
		right: 8%;
		width: 100px;
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
		padding: var(--space-xl) 0;
		pointer-events: auto;
	}

	.content-section + .content-section {
		border-top: 1px solid var(--color-border);
	}

	.section-heading {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-bright);
		margin-bottom: var(--space-lg);
		-webkit-text-stroke: 0.3px currentColor;
	}

	/* --- about --- */
	.bio p {
		font-family: var(--font-condensed);
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text);
		margin-bottom: 0.75rem;
	}

	.bio p:last-child {
		margin-bottom: 0;
	}

	.bio strong {
		font-weight: 700;
		color: var(--color-text-bright);
	}

	.bio a {
		color: var(--color-accent);
	}

	/* --- portfolio --- */
	.section-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-lg);
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
