<script lang="ts">
	import { page } from '$app/state';

	const navLinks = [
		{ name: 'About', url: '/about', texture: 0 },
		{ name: 'Portfolio', url: '/portfolio', texture: 2 },
		{ name: 'Illustrations', url: '/illustrations', texture: 4 },
		{ name: 'Resume', url: '/resume', texture: 1 },
		{ name: 'Contact', url: '/contact', texture: 3 }
	];

	function hexPoints(size: number): string {
		const pts: string[] = [];
		for (let i = 0; i < 6; i++) {
			const angle = (Math.PI / 3) * i - Math.PI / 2;
			pts.push(`${size * Math.cos(angle)},${size * Math.sin(angle)}`);
		}
		return pts.join(' ');
	}
</script>

<header class="header">
	<div class="container">
		<nav class="nav" aria-label="Main navigation">
			<a href="/" class="name">Tory Lysik</a>
			<div class="links">
				{#each navLinks as link, idx}
					<a href={link.url} class:active={page.url.pathname === link.url}>{link.name}</a>
					{#if idx < navLinks.length - 1}
						<svg class="nav-hex" viewBox="-24 -24 48 48" width="20" height="20" aria-hidden="true">
							<polygon points={hexPoints(22)} fill="currentColor" />
						</svg>
					{/if}
				{/each}
			</div>
		</nav>
	</div>
</header>

<style>
	.header {
		padding: var(--space-xl) 0 var(--space-md);
	}

	.nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		text-align: center;
	}

	.name {
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-text-bright);
		text-decoration: none;
		line-height: 1.2;
		letter-spacing: 0.02em;
		-webkit-text-stroke: 0.4px currentColor;
	}

	.name:hover {
		color: var(--color-text-bright);
	}

	.links {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		-webkit-text-stroke: 0.3px currentColor;
	}

	.nav-hex {
		color: var(--color-accent);
		opacity: 0.85;
		flex-shrink: 0;
	}

	.links a {
		color: var(--color-text-muted);
		text-decoration: none;
		padding: 0.625rem 0.25rem;
		min-height: 44px;
		display: flex;
		align-items: center;
		-webkit-text-stroke: 0;
	}

	.links a:hover {
		color: var(--color-text-bright);
	}

	.links a.active {
		color: var(--color-accent);
	}

	@media (max-width: 640px) {
		.header {
			padding: var(--space-lg) 0 var(--space-sm);
		}

		.name {
			font-size: 2rem;
		}

		.links {
			font-size: 0.875rem;
			gap: 0.5rem 0.75rem;
		}

		.nav-hex {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.name {
			font-size: 1.625rem;
		}

		.links {
			font-size: 0.8125rem;
		}
	}
</style>
