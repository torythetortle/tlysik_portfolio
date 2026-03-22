<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - Tory Lysik</title>
</svelte:head>

<div class="error-page">
	<div class="container">
		<span class="error-code">{page.status}</span>
		<p class="error-message">{page.error?.message || 'Something went wrong'}</p>
		<a href="/" class="back-link">&larr; Back to home</a>
	</div>
</div>

<style>
	.error-page {
		padding-top: var(--space-2xl);
		padding-bottom: var(--space-2xl);
	}

	.error-code {
		font-family: var(--font-mono);
		font-size: 5rem;
		font-weight: 700;
		color: var(--color-accent);
		line-height: 1;
		display: block;
		margin-bottom: var(--space-sm);
	}

	.error-message {
		font-family: var(--font-mono);
		font-size: 1.125rem;
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.back-link {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		text-decoration: none;
		border-bottom: 1px solid var(--color-border);
		transition: color var(--transition-base), border-color var(--transition-base);
	}

	.back-link:hover {
		color: var(--color-text-bright);
		border-color: var(--color-accent);
	}
</style>
