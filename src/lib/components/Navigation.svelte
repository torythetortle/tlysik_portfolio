<script lang="ts">
	import { page } from '$app/state';

	const navLinks = [
		{ name: 'Portfolio', url: '/portfolio' },
		{ name: 'Resume', url: '/resume' },
		{ name: 'Contact', url: '/contact' },
		{ name: 'RSS', url: '/work' }
	];
</script>

<header class="header">
	<div class="container">
		<nav class="nav" aria-label="Main navigation">
			<a href="/" class="name">Tory Lysik</a>
			<div class="links">
				{#each navLinks as link}
					<a href={link.url} class:active={page.url.pathname === link.url}>{link.name}</a>
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
		font-weight: 400;
		color: var(--color-text-bright);
		text-decoration: none;
		line-height: 1.2;
		letter-spacing: 0.02em;
	}

	.name:hover {
		color: var(--color-text-bright);
	}

	.links {
		display: flex;
		gap: var(--space-lg);
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.links a {
		color: var(--color-text-muted);
		text-decoration: none;
		padding: 0.25rem 0;
	}

	.links a:hover {
		color: var(--color-text-bright);
	}

	.links a.active {
		color: var(--color-accent);
		font-weight: 700;
	}

	@media (max-width: 480px) {
		.header {
			padding: var(--space-lg) 0 var(--space-sm);
		}

		.name {
			font-size: 1.75rem;
		}

		.links {
			gap: 0.75rem;
			flex-wrap: wrap;
		}

		.links a {
			padding: 0.375rem 0;
			font-size: 0.8125rem;
		}
	}
</style>
