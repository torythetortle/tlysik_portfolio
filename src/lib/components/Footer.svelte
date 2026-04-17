<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="container">
		<p>
			Copyright &copy; <strong>Tory Lysik</strong> {currentYear}. Find me on
			<a href="https://bsky.app/profile/tlysik.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>,
			<a href="https://x.com/tblysik" target="_blank" rel="noopener noreferrer">Twitter</a>,
			<a href="https://www.linkedin.com/in/tory-lysik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>,
			or see whatever code and repositories I happen to have public on <a href="https://github.com/torythetortle" target="_blank" rel="noopener noreferrer">GitHub</a>.
		</p>
	</div>
</footer>

<style>
	.footer {
		padding: var(--space-2xl) 0 var(--space-lg);
		border-top: 1px solid var(--color-border);
		margin-top: var(--space-2xl);
	}

	p {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	p a {
		color: var(--color-text-muted);
		text-decoration: underline;
	}

	p a:hover {
		color: var(--color-text-bright);
	}

	@media (max-width: 480px) {
		.footer {
			padding: var(--space-lg) 0 var(--space-md);
			margin-top: var(--space-lg);
		}

		p {
			font-size: 0.75rem;
		}
	}
</style>
