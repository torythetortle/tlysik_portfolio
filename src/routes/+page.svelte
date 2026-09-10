<script lang="ts">
	import { onMount } from 'svelte';
	import { projects as allProjects } from '$lib/data/projects';

	let stickyVisible = $state(false);
	const currentYear = new Date().getFullYear();

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

	const featuredProjects = [...allProjects]
		.filter((p) => p.featured)
		.sort((a, b) => b.date.localeCompare(a.date));

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function formatDate(dateStr: string): string {
		const [year, month] = dateStr.split('-').map(Number);
		return `${monthNames[month - 1]} ${year}`;
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
						seeds[i].x -= nx * overlap; seeds[i].y -= ny * overlap;
						seeds[j].x += nx * overlap; seeds[j].y += ny * overlap;
						const dvx = seeds[j].vx - seeds[i].vx;
						const dvy = seeds[j].vy - seeds[i].vy;
						const dvn = dvx * nx + dvy * ny;
						if (dvn < 0) {
							const impulse = dvn * 0.75;
							seeds[i].vx += nx * impulse; seeds[i].vy += ny * impulse;
							seeds[j].vx -= nx * impulse; seeds[j].vy -= ny * impulse;
						}
					}
				}
			}

			// cap speed
			for (let i = 0; i < seeds.length; i++) {
				const speed = Math.sqrt(seeds[i].vx ** 2 + seeds[i].vy ** 2);
				if (speed > 0.75) {
					seeds[i].vx = (seeds[i].vx / speed) * 0.75;
					seeds[i].vy = (seeds[i].vy / speed) * 0.75;
				}
			}

			// write to DOM directly — faster than going through Svelte's scheduler
			for (let i = 0; i < seeds.length; i++) {
				const el = seedEls[i];
				if (!el) continue;
				el.style.left = seeds[i].x + 'px';
				el.style.top = seeds[i].y + 'px';
				el.style.transform = `rotate(${seeds[i].rotation}deg)`;
			}
		}

		animId = requestAnimationFrame(tick);

		// sticky nav: show after hero leaves viewport
		const heroEl = document.querySelector('.hero');
		const observer = new IntersectionObserver(
			([entry]) => { stickyVisible = !entry.isIntersecting; },
			{ threshold: 0 }
		);
		if (heroEl) observer.observe(heroEl);

		return () => {
			cancelAnimationFrame(animId);
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
			style="left:{seed.x}px;top:{seed.y}px;width:{seed.size}px;transform:rotate({seed.rotation}deg);"
			draggable="false"
		/>
	{/each}
	<img src="/dandis/flower1.svg" alt="" class="flower flower-left" />
	<img src="/dandis/flower2.svg" alt="" class="flower flower-right" />
</div>

<!-- sticky nav (appears after scrolling past hero) -->
{#if stickyVisible}
	<header class="sticky-nav" aria-label="Site navigation">
		<div class="sticky-inner">
			<a href="#hero" class="sticky-name">Tory Lysik</a>
			<nav class="sticky-links">
				<a href="#portfolio">Select Work</a>
				<span class="nav-dot" aria-hidden="true">·</span>
				<a href="#about">About</a>
				<span class="nav-dot" aria-hidden="true">·</span>
				<a href="/illustrations">Illustrations</a>
				<span class="nav-dot" aria-hidden="true">·</span>
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
			<p class="tagline">Computational journalist</p>
			<nav class="hero-nav" aria-label="Primary">
				<a href="#portfolio">Select Work</a>
				<span class="nav-dot" aria-hidden="true">·</span>
				<a href="#about">About</a>
				<span class="nav-dot" aria-hidden="true">·</span>
				<a href="/illustrations">Illustrations</a>
				<span class="nav-dot" aria-hidden="true">·</span>
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
	</section>

	<!-- PORTFOLIO -->
	<section id="portfolio" class="content-section">
		<div class="container wide">
			<h2 class="section-heading">Select Work</h2>
			<div class="project-grid">
				{#each featuredProjects as project}
					<article class="project">
						{#if project.thumbnail}
							<a href="/portfolio/{project.slug}" class="project-thumbnail">
								<img src={project.thumbnail} alt="{project.title} — {project.outlet}" loading="lazy" />
							</a>
						{/if}
						<div class="project-content">
							<span class="project-meta">{project.category} · {formatDate(project.date)}</span>
							<a href="/portfolio/{project.slug}" class="project-title">{project.title}</a>
							<span class="project-outlet">{project.outlet}</span>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- ABOUT -->
	<section id="about" class="content-section">
		<div class="container">
			<h2 class="section-heading">About</h2>
			<div class="bio">
				<p>I'm a <strong>computational and graphics journalist</strong> based in <strong>New York City</strong>. I most recently worked as a reporter at the <strong>Tow Center for Digital Journalism</strong> at Columbia University.</p>
				<p>
					I've worked at <a href="https://www.axios.com/results?q=tory%20lysik&sort=2" target="_blank" rel="noopener noreferrer">Axios</a>, <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a>, <a href="https://www.themarshallproject.org/" target="_blank" rel="noopener noreferrer">The Marshall Project</a>, the <a href="https://apnews.com/" target="_blank" rel="noopener noreferrer">Associated Press</a>, and others — spanning local shoeleather reporting to <strong>interactive graphics and data tools</strong>. My work has received numerous awards and has been cited in <strong>congressional testimony and federal legislation</strong>.
				</p>
				<p>
					I care deeply about <strong>accessibility</strong> — making complex, critical information clear and understandable. Whether diving into legal documents, filing FOIA requests, or building maps to surface human rights issues, I thrive in the meticulous, detail-heavy work that makes complex stories click.
				</p>
				<p>In my free time, I'm usually escaping NYC for the mountains or working on becoming fluent in a fifth language.</p>
				<div class="skills-row">
					<span class="label">Tools</span>
					<span class="skills-value">Python · R · SQL · JavaScript/TypeScript · Svelte · D3 · React · Mapbox · QGIS · Adobe Illustrator · LLM-assisted reporting · FOIA/public records</span>
				</div>
			</div>
		</div>
	</section>

	<!-- CONTACT / FOOTER -->
	<footer id="contact" class="site-footer">
		<img src="/dandis/flower1.svg" alt="" class="footer-flower footer-flower-left" />
		<img src="/dandis/flower2.svg" alt="" class="footer-flower footer-flower-right" />
		<div class="container">
			<div class="footer-contact">
				<a href="mailto:lysiktory@gmail.com">lysiktory@gmail.com</a>
				<span class="dot">·</span>
				<span>Signal: TBLysik.85</span>
				<span class="dot">·</span>
				<a href="https://github.com/torythetortle" target="_blank" rel="noopener noreferrer">GitHub</a>
				<span class="dot">·</span>
				<a href="https://www.linkedin.com/in/tory-lysik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<span class="dot">·</span>
				<a href="https://x.com/tblysik" target="_blank" rel="noopener noreferrer">X</a>
				<span class="dot">·</span>
				<a href="https://bsky.app/profile/tlysik.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
			</div>
			<p class="footer-copyright">Copyright &copy; <strong>Tory Lysik</strong> {currentYear}</p>
		</div>
	</footer>
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
		pointer-events: none;
		user-select: none;
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
		justify-content: center;
		flex-wrap: wrap;
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

	.nav-dot {
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		pointer-events: none;
		padding: var(--space-2xl) 0 var(--space-xl);
	}

	.hero-content {
		text-align: center;
		padding: 0 var(--space-2xl);
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
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--color-accent);
		margin: 0 0 0.5rem;
		letter-spacing: 0.02em;
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

	.hero-nav a:hover {
		color: var(--color-text-bright);
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
		font-weight: 400;
		color: var(--color-text-muted);
		text-decoration: none;
		letter-spacing: 0.01em;
		transition: color var(--transition-base);
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.hero-socials a:hover {
		color: var(--color-accent);
	}

	.social-dot {
		color: var(--color-accent);
		font-size: 1rem;
		line-height: 1;
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

	.skills-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-lg);
		margin-top: var(--space-md);
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
	}

	.skills-value {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	/* --- portfolio --- */

	.container.wide {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-xl);
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-lg) var(--space-md);
	}

	.project {
		display: flex;
		flex-direction: column;
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		overflow: hidden;
		transition: border-color var(--transition-base);
	}

	.project:hover {
		border-color: var(--color-accent);
	}

	.project-thumbnail {
		display: block;
		overflow: hidden;
		border-bottom: 1px solid var(--color-border);
	}

	.project-thumbnail img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		opacity: 0.88;
		transition: opacity var(--transition-base);
	}

	.project-thumbnail:hover img {
		opacity: 1;
	}

	.project-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: var(--space-sm);
	}

	.project-meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.project-title {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--color-text-bright);
		line-height: 1.4;
		text-decoration: none;
		display: block;
		padding: 0.375rem 0 0.5rem;
		transition: color var(--transition-base);
	}

	.project-title:hover {
		color: var(--color-accent);
	}

	.project-outlet {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin-top: auto;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
	}

	/* --- footer / contact --- */
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

	.site-footer {
		background: rgba(255, 255, 255, 0.97);
		position: relative;
		padding: var(--space-lg) 0 var(--space-xl);
		border-top: 1px solid var(--color-border);
		pointer-events: auto;
		overflow: hidden;
		text-align: center;
	}

	.footer-flower {
		position: absolute;
		bottom: 0;
		height: auto;
		opacity: 0.5;
		pointer-events: none;
	}

	.footer-flower-left {
		left: 2%;
		width: 90px;
	}

	.footer-flower-right {
		right: 4%;
		width: 34px;
	}

	.footer-contact {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.footer-contact a {
		color: var(--color-text-bright);
		text-decoration: none;
		transition: color var(--transition-base);
	}

	.footer-contact a:hover {
		color: var(--color-accent);
	}

	.footer-contact .dot {
		color: var(--color-accent);
	}

	.footer-copyright {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	/* --- responsive --- */
	@media (max-width: 1024px) {
		.project-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
	}

	@media (max-width: 800px) {
		.project-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 720px) {
		.name { font-size: 2.25rem; }
		.tagline { font-size: 0.875rem; }
		.hero-content { padding: 0 var(--space-md); }
	}

	@media (max-width: 640px) {
		.project-grid { grid-template-columns: 1fr; }
		.sticky-inner { padding: 0.625rem var(--space-md); }
		.sticky-links { gap: 0.5rem; font-size: 0.75rem; }
		.container.wide { padding: 0 var(--space-md); }
	}

	@media (max-width: 480px) {
		.name { font-size: 1.75rem; }
		.hero-nav { gap: 0.5rem; }
		.hero-nav a { font-size: 0.8125rem; }
		.skills-row { flex-direction: column; gap: var(--space-xs); }
		.sticky-links { gap: 0.5rem; font-size: 0.7rem; }
		.sticky-inner { padding: 0.5rem var(--space-sm); gap: var(--space-sm); }
		.sticky-name { font-size: 0.9rem; }
		.container.wide { padding: 0 var(--space-sm); }
		.footer-contact { gap: 0.375rem 0.625rem; }
		.bio p { font-size: 1rem; line-height: 1.7; }
		.section-heading { font-size: 1.375rem; }
	}
</style>
