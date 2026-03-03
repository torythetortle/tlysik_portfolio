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
		gap: var(--space-sm);
	}

	.name {
		font-family: var(--font-mono);
		font-size: 2.75rem;
		font-weight: 700;
		color: var(--color-text-bright);
		text-decoration: none;
		line-height: 1.2;
	}

	.name:hover {
		color: var(--color-text-bright);
	}

	.links {
		display: flex;
		gap: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.links a {
		color: var(--color-text-muted);
		text-decoration: underline;
	}

	.links a:hover {
		color: var(--color-text-bright);
	}

	.links a.active {
		color: var(--color-text-bright);
		font-weight: 700;
	}

	@media (max-width: 480px) {
		.name {
			font-size: 2rem;
		}

		.links {
			gap: 1rem;
			flex-wrap: wrap;
		}
	}
</style>
