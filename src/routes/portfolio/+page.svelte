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
	<title>Portfolio - Tory Lysik</title>
	<meta
		name="description"
		content="Selected data journalism, investigations, and visual storytelling by Tory Lysik."
	/>
</svelte:head>

<div class="page">
	<div class="container">
		<div class="grid">
			{#each featuredProjects as project}
				<article class="project">
					{#if project.thumbnail}
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							class="project-thumbnail"
						>
							<img src={project.thumbnail} alt={project.title} loading="lazy" />
						</a>
					{/if}
					<div class="project-content">
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							class="project-title"
						>
							{project.title}
						</a>
						<span class="project-outlet">{project.outlet} · {formatDate(project.date)}</span>

						<p class="project-description">{project.description}</p>

						{#if project.additionalLinks?.length}
							<p class="project-meta project-links">
								<a href={project.link} target="_blank" rel="noopener noreferrer">Part 1</a>
								{#each project.additionalLinks as extra}
									· <a href={extra.url} target="_blank" rel="noopener noreferrer">{extra.label}</a>
								{/each}
							</p>
						{/if}

						{#if project.awards}
							<p class="project-meta project-award">
								{project.awards}
							</p>
						{/if}

						{#if project.tags.length > 0}
							<p class="project-meta project-tags">
								{project.tags.join(' / ')}
							</p>
						{/if}
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

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-xl);
	}

	.project {
		display: flex;
		flex-direction: column;
	}

	.project-thumbnail {
		display: block;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: var(--space-sm);
	}

	.project-thumbnail img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
		border-radius: 8px;
		opacity: 0.85;
		transition: opacity var(--transition-base);
	}

	.project-thumbnail:hover img {
		opacity: 1;
	}

	.project-content {
		flex: 1;
	}

	.project-title {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		font-weight: 600;
		color: var(--color-text-bright);
		line-height: 1.4;
		text-decoration: none;
		display: block;
		margin-bottom: 4px;
	}

	.project-title:hover {
		color: var(--color-accent);
	}

	.project-outlet {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.project-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text);
		margin-top: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.project-meta {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin-bottom: 0.25rem;
	}

	.project-award {
		color: var(--color-accent);
	}

	.project-tags {
		font-size: 0.6875rem;
		letter-spacing: 0.02em;
	}

	.project-links a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	.project-links a:hover {
		color: var(--color-accent-hover);
	}

	@media (max-width: 1024px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.project-title {
			font-size: 1rem;
		}
	}
</style>
