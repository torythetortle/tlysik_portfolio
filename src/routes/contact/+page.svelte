<svelte:head>
	<title>Contact - Tory Lysik</title>
	<meta name="description" content="Get in touch with Tory Lysik." />
</svelte:head>

<div class="page">
	<div class="container">
		<div class="contact-links">
			<a href="mailto:lysiktory@gmail.com">lysiktory@gmail.com</a>
			<a href="https://github.com/torythetortle" target="_blank" rel="noopener noreferrer">GitHub</a>
			<a href="https://www.linkedin.com/in/tory-lysik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
			<a href="https://x.com/tblysik" target="_blank" rel="noopener noreferrer">X</a>
			<a href="https://bsky.app/profile/tlysik.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>
		</div>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	.contact-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.contact-links a {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--color-text-muted);
		text-decoration: underline;
		width: fit-content;
	}

	.contact-links a:hover {
		color: var(--color-text-bright);
	}
</style>
