<svelte:head>
	<title>Resume - Tory Lysik</title>
	<meta name="description" content="Resume of Tory Lysik, data journalist." />
</svelte:head>

<div class="page">
	<div class="container">
		<a href="/resume.pdf" class="resume-download" target="_blank" rel="noopener noreferrer">
			Download full resume (PDF) &darr;
		</a>

		<section class="resume-section">
			<h2>Experience</h2>
			<div class="entries">
				<div class="entry">
					<div class="entry-left">
						<span class="org">Tow Center for Digital Journalism</span>
						<span class="title">Data Journalist, Research Fellow</span>
					</div>
					<span class="date">May 2025–Present</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Freelancer</span>
						<span class="title">Data and Graphics Journalist</span>
					</div>
					<span class="date">Aug 2024–May 2025</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Axios</span>
						<span class="title">Data Visualization Journalist</span>
					</div>
					<span class="date">Aug 2022–Aug 2024</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Vox</span>
						<span class="title">Reporter, Politics and Policy</span>
					</div>
					<span class="date">May 2022–Aug 2022</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">D.C. Witness</span>
						<span class="title">Associate Editor, Data Reporter</span>
					</div>
					<span class="date">Apr 2021–May 2022</span>
				</div>
			</div>
		</section>

		<section class="resume-section">
			<h2>Education</h2>
			<div class="entries">
				<div class="entry">
					<div class="entry-left">
						<span class="org">Columbia University Graduate School of Journalism</span>
						<span class="title">M.S., Journalism — Certificate, Lede Program</span>
					</div>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">University of Colorado Boulder</span>
						<span class="title">B.A., Journalism — B.S., Political Science — Minor, International Media</span>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	.resume-download {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-accent);
		display: inline-block;
		margin-bottom: var(--space-2xl);
	}

	.resume-download:hover {
		color: var(--color-accent-hover);
	}

	.resume-section {
		margin-bottom: var(--space-2xl);
	}

	h2 {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-muted);
		margin-bottom: var(--space-md);
	}

	.entries {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.entry {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-md);
	}

	.entry-left {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.org {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.title {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--color-muted);
	}

	.date {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
		white-space: nowrap;
		flex-shrink: 0;
	}
</style>
