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
						<span class="org">Freelance</span>
						<span class="title">Data and Graphics Journalist</span>
						<span class="description">Pitched and reported stories for Cipher, Business Insider, Use Case Magazine, Them, AP, and others</span>
						<span class="description">Long-term contractor for The Marshall Project — Dagster ML pipelines, interactive graphics, Svelte stories, source interviewing</span>
					</div>
					<span class="date">Aug 2024–May 2025</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Axios</span>
						<span class="title">Data Visualization Journalist (laid off in team-wide layoff)</span>
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
						<span class="org">D.C. Witness + Poynter Institute</span>
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

		<section class="resume-section">
			<h2>Awards</h2>
			<div class="entries">
				<div class="entry-simple">Information is Beautiful: 2023 Finalist — "No Passport No Problem" — Axios</div>
				<div class="entry-simple">Colorado Press Association: Best Infographics & Best Newsletter of 2023 — Axios; Best Editorial Collaboration of 2022 — "The Central 70 Project" — The Denver Gazette</div>
				<div class="entry-simple">Society of Professional Journalists: Best Online News Reporting winner, 2019 and 2020</div>
				<div class="entry-simple">Judge: 2023 Al Nakkula Award for Police Reporting; 2023 and 2024 Information is Beautiful Awards</div>
			</div>
		</section>

		<section class="resume-section">
			<h2>Professional Affiliations</h2>
			<p class="affiliations">Data Visualization Society, Investigative Reporters and Editors, Online News Association, Society of Professional Journalists, Overseas Press Club, Society for News Design, The Association of LGBTQ+ Journalists, International Federation of Journalists, National Association of Hispanic Journalists, Association of Health Care Journalists, Society of Environmental Journalists</p>
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

	.description {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--color-muted);
		line-height: 1.5;
	}

	.entry-simple {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--color-text);
		line-height: 1.6;
	}

	.affiliations {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--color-text);
		line-height: 1.6;
		margin: 0;
	}
</style>
