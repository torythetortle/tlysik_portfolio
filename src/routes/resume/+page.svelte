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
				<div class="entry">
					<div class="entry-left">
						<span class="org">Information is Beautiful</span>
						<span class="title">2023 Finalist — "No Passport No Problem" — Axios</span>
					</div>
					<span class="date">2023</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Colorado Press Association</span>
						<span class="title">Best Infographics & Best Newsletter of 2023 — Axios</span>
						<span class="title">Best Editorial Collaboration of 2022 — "The Central 70 Project" — The Denver Gazette</span>
					</div>
					<span class="date">2022–2023</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Society of Professional Journalists</span>
						<span class="title">Best Online News Reporting winner</span>
					</div>
					<span class="date">2019–2020</span>
				</div>
			</div>
		</section>

		<section class="resume-section">
			<h2>Speaking & Engagement</h2>
			<div class="entries">
				<div class="entry">
					<div class="entry-left">
						<span class="org">Data Visualization Society</span>
						<span class="title">Mentor</span>
					</div>
					<span class="date">2023–Present</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Columbia Journalism School</span>
						<span class="title">Asst. Professor, Mapping and Data Visualization course</span>
					</div>
					<span class="date">2025</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">NICAR</span>
						<span class="title">Multiple talks including making your first SvelteKit and web scraping with AI</span>
					</div>
					<span class="date">2025–2026</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">C+J 2025 Conference</span>
						<span class="title">Scraper Factories: Using AI to write fleets of unique scrapers at once</span>
					</div>
					<span class="date">2025</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Al Nakkula Award for Police Reporting</span>
						<span class="title">Judge</span>
					</div>
					<span class="date">2023–2024</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Information is Beautiful Awards</span>
						<span class="title">Judge</span>
					</div>
					<span class="date">2024–2025</span>
				</div>
				<div class="entry">
					<div class="entry-left">
						<span class="org">Slate Money Podcast</span>
						<span class="title">Multiple appearances for various topics</span>
					</div>
					<span class="date">2023–2025</span>
				</div>
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
		font-size: 0.9375rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text);
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

	@media (max-width: 640px) {
		.entry {
			flex-direction: column;
			gap: 0.25rem;
		}

		.date {
			white-space: normal;
			font-size: 0.75rem;
		}

		.org {
			font-size: 0.85rem;
		}

		.title {
			font-size: 0.8rem;
		}

		.description {
			font-size: 0.75rem;
		}

		.entry-simple {
			font-size: 0.8rem;
		}

		.affiliations {
			font-size: 0.8rem;
		}
	}
</style>
