<script>
	import { page } from '$app/state';

	const message = page.status === 404
		? "This page doesn't exist — or it moved."
		: (page.error?.message || 'Something went wrong.');
</script>

<svelte:head>
	<title>{page.status} - Tory Lysik</title>
</svelte:head>

<div class="error-page">
	<div class="container">
		<div class="hex-row" aria-hidden="true">
			<svg viewBox="-24 -24 48 48" width="36" height="36">
				<polygon points="0,-22 19.05,-11 19.05,11 0,22 -19.05,11 -19.05,-11" fill="#00a5cf" />
			</svg>
			<svg viewBox="-24 -24 48 48" width="36" height="36">
				<polygon points="0,-22 19.05,-11 19.05,11 0,22 -19.05,11 -19.05,-11" fill="#25a18e" />
			</svg>
			<svg viewBox="-24 -24 48 48" width="36" height="36">
				<polygon points="0,-22 19.05,-11 19.05,11 0,22 -19.05,11 -19.05,-11" fill="#5cbfa6" />
			</svg>
		</div>
		<span class="error-code">{page.status}</span>
		<p class="error-message">{message}</p>
		<a href="/" class="back-link">&larr; Back to home</a>
	</div>
</div>

<style>
	.error-page {
		padding-top: var(--space-2xl);
		padding-bottom: var(--space-2xl);
	}

	.hex-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: var(--space-md);
	}

	.error-code {
		font-family: var(--font-mono);
		font-size: 6rem;
		font-weight: 700;
		color: var(--color-accent);
		-webkit-text-stroke: 1px var(--color-accent);
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
		font-weight: 700;
		color: var(--color-accent);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		transition: color var(--transition-base);
	}

	.back-link:hover {
		color: var(--color-accent-hover);
	}

	@media (max-width: 480px) {
		.error-code {
			font-size: 4rem;
		}

		.error-message {
			font-size: 1rem;
		}
	}
</style>
