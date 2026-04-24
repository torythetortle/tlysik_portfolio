<script lang="ts">
	import type { Project } from '$lib/data/projects';

	let { data } = $props();
	const project: Project = data.project;

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function formatDate(dateStr: string): string {
		const [year, month] = dateStr.split('-').map(Number);
		return `${monthNames[month - 1]} ${year}`;
	}
</script>

<svelte:head>
	<title>{project.title} - Tory Lysik</title>
	<meta name="description" content={project.description.slice(0, 160)} />
	<link rel="canonical" href="https://tlysik.com/portfolio/{project.slug}" />

	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://tlysik.com/portfolio/{project.slug}" />
	<meta property="og:title" content="{project.title} — {project.outlet}" />
	<meta property="og:description" content={project.description.slice(0, 200)} />
	{#if project.thumbnail}
		<meta property="og:image" content="https://tlysik.com{project.thumbnail}" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{project.title} — {project.outlet}" />
	<meta name="twitter:description" content={project.description.slice(0, 200)} />
	{#if project.thumbnail}
		<meta name="twitter:image" content="https://tlysik.com{project.thumbnail}" />
	{/if}
</svelte:head>

<div class="page">
	<div class="container">
		<a href="/portfolio" class="back-link">&larr; All projects</a>

		<article class="project-detail">
			{#if project.thumbnail}
				<div class="project-image">
					<img src={project.thumbnail} alt="{project.title} — {project.outlet}" />
				</div>
			{/if}

			<h1>{project.title}</h1>

			<div class="project-meta-row">
				<span class="outlet">{project.outlet}</span>
				<span class="date">{formatDate(project.date)}</span>
				<span class="category">{project.category}</span>
			</div>

			<div class="project-description">
				<p>{project.description}</p>
			</div>

			<div class="project-links">
				{#if project.link}
					<a href={project.link} target="_blank" rel="noopener noreferrer" class="primary-link">
						View project &rarr;
					</a>
				{/if}
				{#if project.additionalLinks?.length}
					{#each project.additionalLinks as extra}
						<a href={extra.url} target="_blank" rel="noopener noreferrer" class="secondary-link">
							{extra.label} &rarr;
						</a>
					{/each}
				{/if}
			</div>

			{#if project.awards}
				<div class="project-awards">
					<span class="detail-label">Awards</span>
					<p>{project.awards}</p>
				</div>
			{/if}

			{#if project.collaborators.length > 0}
				<div class="project-collaborators">
					<span class="detail-label">Collaborators</span>
					<p>{project.collaborators.join(', ')}</p>
				</div>
			{/if}

			{#if project.tags.length > 0}
				<div class="project-tags">
					<span class="detail-label">Tools & methods</span>
					<div class="tags">
						{#each project.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}
		</article>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	.back-link {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-muted);
		text-decoration: none;
		display: inline-block;
		margin-bottom: var(--space-xl);
		transition: color var(--transition-base);
	}

	.back-link:hover {
		color: var(--color-text-bright);
	}

	.project-detail {
		max-width: 760px;
	}

	.project-image {
		overflow: hidden;
		margin-bottom: var(--space-lg);
	}

	.project-image img {
		width: 100%;
		display: block;
	}

	h1 {
		font-family: var(--font-body);
		font-size: 1.75rem;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: var(--space-sm);
	}

	.project-meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-md);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-bright);
		margin-bottom: var(--space-lg);
	}

	.category {
		color: var(--color-accent);
	}

	.project-description {
		margin-bottom: var(--space-lg);
	}

	.project-description p {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: var(--color-text);
		white-space: pre-line;
	}

	.project-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-xl);
	}

	.primary-link {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-bg);
		background: var(--color-accent);
		padding: 0.5rem 1.25rem;
		border-radius: 4px;
		text-decoration: none;
		transition: background var(--transition-base);
	}

	.primary-link:hover {
		background: var(--color-accent-hover);
		color: var(--color-bg);
	}

	.secondary-link {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-muted);
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		text-decoration: none;
		transition: border-color var(--transition-base), color var(--transition-base);
	}

	.secondary-link:hover {
		border-color: var(--color-accent);
		color: var(--color-text-bright);
	}

	.detail-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		display: block;
		margin-bottom: var(--space-xs);
	}

	.project-awards,
	.project-collaborators,
	.project-tags {
		margin-bottom: var(--space-lg);
	}

	.project-awards p,
	.project-collaborators p {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		padding: 0.25rem 0.625rem;
		border-radius: 3px;
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 1.375rem;
		}

		.project-description p {
			font-size: 1rem;
		}
	}
</style>
