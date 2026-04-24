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

		<div class="contact-list">
			<div class="contact-row">
				<span class="label">Email</span>
				<div class="contact-value">
					<a href="mailto:lysiktory@gmail.com">lysiktory@gmail.com</a>
					<a href="mailto:TL3291@columbia.edu">TL3291@columbia.edu</a>
				</div>
			</div>
			<div class="contact-row">
				<span class="label">Signal</span>
				<span class="contact-value">TBLysik.85</span>
			</div>
		</div>

		<div class="social-links">
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
		margin-bottom: var(--space-xl);
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-xl);
	}

	.contact-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-lg);
	}

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

	.contact-value {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-bright);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-md);
	}

	.contact-value a {
		color: var(--color-text-bright);
		text-decoration: none;
		border-bottom: 1px solid var(--color-border);
		transition: color var(--transition-base), border-color var(--transition-base);
	}

	.contact-value a:hover {
		color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.social-links {
		display: flex;
		gap: var(--space-md);
		padding-top: var(--space-md);
		flex-wrap: wrap;
	}

	.social-links a {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-bright);
		text-decoration: none;
		transition: color var(--transition-base);
		-webkit-text-stroke: 0.3px currentColor;
	}

	.social-links a:hover {
		color: var(--color-accent);
	}

	@media (max-width: 480px) {
		.contact-row {
			flex-direction: column;
			gap: var(--space-xs);
		}

		.social-links {
			flex-wrap: wrap;
		}
	}
</style>
