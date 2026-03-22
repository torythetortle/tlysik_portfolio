<svelte:head>
	<title>Contact - Tory Lysik</title>
	<meta name="description" content="Get in touch with Tory Lysik — email, GitHub, and social links." />
	<link rel="canonical" href="https://tlysik.com/contact" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/contact" />
	<meta property="og:title" content="Contact - Tory Lysik" />
	<meta property="og:description" content="Get in touch with Tory Lysik — email, GitHub, and social links." />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Contact - Tory Lysik" />
	<meta name="twitter:description" content="Get in touch with Tory Lysik — email, GitHub, and social links." />
</svelte:head>

<div class="page">
	<div class="container">
		<p class="contact-intro">Feel free to reach out by email or on Signal.</p>

		<div class="contact-details">
			<p><span class="label">Email:</span> <a href="mailto:lysiktory@gmail.com">lysiktory@gmail.com</a> and/or <a href="mailto:TL3291@columbia.edu">TL3291@columbia.edu</a></p>
			<p><span class="label">Signal:</span> TBLysik.85</p>
		</div>

		<div class="contact-links">
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

	.contact-intro {
		font-size: 1rem;
		color: var(--color-text);
		margin-bottom: var(--space-lg);
	}

	.contact-details {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.contact-details a {
		color: var(--color-text-muted);
		text-decoration: underline;
	}

	.contact-details a:hover {
		color: var(--color-text-bright);
	}

	.label {
		color: var(--color-text-bright);
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
