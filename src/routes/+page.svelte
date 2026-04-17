<script lang="ts">
	import { onMount } from 'svelte';

	interface Cell {
		col: number;
		row: number;
		x: number;
		y: number;
		filled: boolean;
		color: string;
		texture: number;
	}

	const PALETTE = ['#7db490', '#5d9872', '#eddce9', '#dcc6d4', '#d88296'];
	const CELL_SIZE = 36;
	const TEXTURE_COUNT = 7;

	let cells = $state<Cell[]>([]);
	let canvasWidth = $state(800);
	let canvasHeight = $state(480);
	let wrapperEl!: HTMLDivElement;

	function buildHoneycomb(w: number, h: number) {
		const hexW = CELL_SIZE * Math.sqrt(3);
		const hexH = CELL_SIZE * 1.5;
		const cols = Math.ceil(w / hexW) + 1;
		const rows = Math.ceil(h / hexH) + 1;
		const next: Cell[] = [];
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const x = col * hexW + (row % 2 ? hexW / 2 : 0);
				const y = row * hexH;
				next.push({
					col,
					row,
					x,
					y,
					filled: false,
					color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
					texture: Math.floor(Math.random() * TEXTURE_COUNT)
				});
			}
		}
		cells = next;
	}

	function toggleCell(i: number) {
		cells[i].filled = !cells[i].filled;
	}

	function onCellKey(i: number, e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleCell(i);
		}
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
		function updateSize() {
			if (!wrapperEl) return;
			canvasWidth = wrapperEl.clientWidth;
			canvasHeight = wrapperEl.clientHeight;
			buildHoneycomb(canvasWidth, canvasHeight);
		}

		updateSize();
		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(wrapperEl);

		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Tory Lysik - Journalist</title>
	<meta
		name="description"
		content="Portfolio of Tory Lysik. Data and graphics journalist."
	/>
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
	<div class="honeycomb-wrapper" bind:this={wrapperEl}>
		<div class="center-label" aria-hidden="false">
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
			<p class="hint">Click the honeycomb.</p>
		</div>

		<svg class="honeycomb" viewBox="0 0 {canvasWidth} {canvasHeight}" preserveAspectRatio="xMidYMid slice">
			<defs>
				<clipPath id="hex-clip">
					<polygon points={hexPoints(CELL_SIZE - 2)} />
				</clipPath>
			</defs>

			{#each cells as cell, i (cell.col + '-' + cell.row)}
				<g transform="translate({cell.x} {cell.y})">
					<polygon
						points={hexPoints(CELL_SIZE - 1)}
						fill={cell.filled ? cell.color : 'transparent'}
						fill-opacity={cell.filled ? 0.2 : 0}
						stroke={cell.filled ? cell.color : 'rgba(93, 152, 114, 0.4)'}
						stroke-width={cell.filled ? 1.6 : 1.2}
						class="cell"
						onclick={() => toggleCell(i)}
						onkeydown={(e) => onCellKey(i, e)}
						role="button"
						tabindex="-1"
						aria-label="Honeycomb cell"
					/>

					{#if cell.filled}
						<g clip-path="url(#hex-clip)" stroke={cell.color} fill={cell.color} stroke-linecap="round" stroke-linejoin="round">
							{#if cell.texture === 0}
								<image href="/images/sunflower.svg" x="-24" y="-24" width="48" height="48" style="filter: brightness(0) invert(1); opacity: 0.95;" />
							{:else if cell.texture === 1}
								<image href="/images/monstera.svg" x="-24" y="-24" width="48" height="48" style="filter: brightness(0) invert(1); opacity: 0.95;" />
							{:else if cell.texture === 2}
								<!-- sunflower rays -->
								{#each Array(12) as _, r}
									<line
										x1="0"
										y1="0"
										x2={Math.cos((r / 12) * Math.PI * 2) * (CELL_SIZE - 6)}
										y2={Math.sin((r / 12) * Math.PI * 2) * (CELL_SIZE - 6)}
										stroke-width="1"
										stroke-opacity="0.85"
									/>
								{/each}
								<circle cx="0" cy="0" r="4" fill-opacity="0.9" stroke="none" />
							{:else if cell.texture === 3}
								<image href="/images/sun.svg" x="-24" y="-24" width="48" height="48" style="filter: brightness(0) invert(1); opacity: 0.95;" />
							{:else if cell.texture === 4}
								<!-- compass rose -->
								<g stroke="none" fill={cell.color}>
									<!-- outer ring -->
									<circle cx="0" cy="0" r="22" fill="none" stroke={cell.color} stroke-width="1.4" />
									<!-- main 4-point star (N-S-E-W) -->
									<polygon points="0,-22 4,-4 0,0 -4,-4" fill-opacity="0.95" />
									<polygon points="0,22 4,4 0,0 -4,4" fill-opacity="0.7" />
									<polygon points="22,0 4,4 0,0 4,-4" fill-opacity="0.95" />
									<polygon points="-22,0 -4,4 0,0 -4,-4" fill-opacity="0.7" />
									<!-- diagonal shorter points -->
									<polygon points="13,-13 3,-3 0,0 0,0" fill-opacity="0.55" />
									<polygon points="-13,13 -3,3 0,0 0,0" fill-opacity="0.55" />
									<polygon points="-13,-13 -3,-3 0,0 0,0" fill-opacity="0.55" />
									<polygon points="13,13 3,3 0,0 0,0" fill-opacity="0.55" />
									<!-- center dot -->
									<circle cx="0" cy="0" r="2.2" />
									<!-- N marker dot -->
									<circle cx="0" cy="-26" r="1.4" fill-opacity="0.8" />
								</g>
							{:else if cell.texture === 5}
								<image href="/images/bee-icon.svg" x="-24" y="-24" width="48" height="48" style="filter: brightness(0) invert(1); opacity: 0.95;" />
							{:else}
								<!-- mini honeycomb -->
								{@const mini = 6}
								{@const miniW = mini * Math.sqrt(3)}
								{@const miniH = mini * 1.5}
								<g fill="none" stroke-width="0.9" stroke-opacity="0.9">
									{#each [-2, -1, 0, 1, 2] as row}
										{#each [-3, -2, -1, 0, 1, 2, 3] as col}
											<polygon
												points={hexPoints(mini - 0.5)}
												transform="translate({col * miniW + (row % 2 ? miniW / 2 : 0)} {row * miniH})"
											/>
										{/each}
									{/each}
								</g>
							{/if}
						</g>
					{/if}
				</g>
			{/each}

		</svg>
	</div>
</div>

<style>
	.home {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
	}

	.honeycomb-wrapper {
		flex: 1;
		position: relative;
		width: 100%;
		height: 100%;
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
		flex-wrap: nowrap;
		gap: 0.75rem;
		margin: var(--space-md) 0;
		pointer-events: auto;
		white-space: nowrap;
	}

	.center-nav a {
		white-space: nowrap;
	}

	.nav-hex {
		color: var(--color-accent);
		opacity: 0.85;
		flex-shrink: 0;
	}

	.center-nav a {
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

	.hint {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.honeycomb {
		width: 100%;
		height: 100%;
		display: block;
	}

	.cell {
		cursor: pointer;
		transition: stroke 0.2s ease, fill-opacity 0.3s ease;
		outline: none;
		-webkit-tap-highlight-color: transparent;
	}

	.cell:focus,
	.cell:focus-visible {
		outline: none;
	}

	.cell:hover {
		stroke: var(--color-accent);
		stroke-width: 1.8;
	}

	.honeycomb {
		-webkit-tap-highlight-color: transparent;
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
		.center-nav {
			flex-wrap: wrap;
			white-space: normal;
		}
	}
</style>
