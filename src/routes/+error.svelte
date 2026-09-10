<script>
	import { page } from '$app/state';

	const message = page.status === 404
		? "This page got redacted. Or it never existed — or it moved."
		: (page.error?.message || 'Something went wrong.');
</script>

<svelte:head>
	<title>{page.status} - Tory Lysik</title>
</svelte:head>

<div class="error-page">
	<div class="scattered-seeds" aria-hidden="true">
		<img src="/dandis/seed1.svg" alt="" class="stray-seed seed-a" />
		<img src="/dandis/seed3.svg" alt="" class="stray-seed seed-b" />
		<img src="/dandis/seed2.svg" alt="" class="stray-seed seed-c" />
	</div>
	<div class="container">
		<span class="error-code">{page.status}</span>
		<p class="error-message">{message}</p>
		<a href="/" class="back-link">&larr; Back to home</a>
	</div>
</div>

<style>
	.error-page {
		position: relative;
		padding-top: var(--space-2xl);
		padding-bottom: var(--space-2xl);
		overflow: hidden;
	}

	.scattered-seeds {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.stray-seed {
		position: absolute;
		height: auto;
		opacity: 0.6;
	}

	.seed-a {
		top: 8%;
		left: 6%;
		width: 46px;
		transform: rotate(-18deg);
	}

	.seed-b {
		top: 62%;
		left: 88%;
		width: 34px;
		transform: rotate(30deg);
	}

	.seed-c {
		top: 28%;
		left: 78%;
		width: 26px;
		transform: rotate(-8deg);
	}

	@media (max-width: 640px) {
		.stray-seed {
			display: none;
		}
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
