<script lang="ts">
	import type { Project } from '$lib/data/projects';

	let { data } = $props();

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function formatDate(dateStr: string): string {
		const [year, month] = dateStr.split('-').map(Number);
		return `${monthNames[month - 1]} ${year}`;
	}

	const featuredProjects = [...data.projects]
		.filter((p: Project) => p.featured)
		.sort((a: Project, b: Project) => b.date.localeCompare(a.date));
</script>

<svelte:head>
	<title>Select Work - Tory Lysik</title>
	<meta
		name="description"
		content="Selected data journalism, investigations, and visual storytelling by Tory Lysik."
	/>
	<link rel="canonical" href="https://tlysik.com/portfolio" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/portfolio" />
	<meta property="og:title" content="Select Work - Tory Lysik" />
	<meta property="og:description" content="Selected data journalism, investigations, and visual storytelling by Tory Lysik." />
	<meta property="og:image" content="https://tlysik.com/images/headshot.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Select Work - Tory Lysik" />
	<meta name="twitter:description" content="Selected data journalism, investigations, and visual storytelling by Tory Lysik." />
	<meta name="twitter:image" content="https://tlysik.com/images/headshot.webp" />
</svelte:head>

<div class="page">
	<div class="container">
		<div class="project-grid">
			{#each featuredProjects as project}
				<article class="project">
					{#if project.thumbnail}
						<a href="/portfolio/{project.slug}" class="project-thumbnail">
							<img src={project.thumbnail} alt="{project.title} — {project.outlet}" loading="lazy" />
						</a>
					{/if}
					<div class="project-content">
						<span class="project-meta">{project.category} · {formatDate(project.date)}</span>
						<a href="/portfolio/{project.slug}" class="project-title">{project.title}</a>
						<span class="project-outlet">{project.outlet}</span>
					</div>
				</article>
			{/each}
		</div>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	.page :global(.container) {
		max-width: 1200px;
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-lg) var(--space-md);
	}

	.project {
		display: flex;
		flex-direction: column;
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		overflow: hidden;
		transition: border-color var(--transition-base);
	}

	.project:hover {
		border-color: var(--color-accent);
	}

	.project-thumbnail {
		display: block;
		overflow: hidden;
		border-bottom: 1px solid var(--color-border);
	}

	.project-thumbnail img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		opacity: 0.88;
		transition: opacity var(--transition-base);
	}

	.project-thumbnail:hover img {
		opacity: 1;
	}

	.project-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: var(--space-sm);
	}

	.project-meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.project-title {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--color-text-bright);
		line-height: 1.4;
		text-decoration: none;
		display: block;
		padding: 0.375rem 0 0.5rem;
		transition: color var(--transition-base);
	}

	.project-title:hover {
		color: var(--color-accent);
	}

	.project-outlet {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin-top: auto;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
	}

	@media (max-width: 1024px) {
		.project-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-lg);
		}
	}

	@media (max-width: 800px) {
		.project-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.project-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
