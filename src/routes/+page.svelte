<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<svelte:head>
	<title>Tory Lysik</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="name">Tory Lysik</h1>
		<p class="bio">
			I am a journalist and AI researcher who tells stories with data and graphics.
		</p>
	</header>

	<main>
		<div class="projects-grid">
			{#each data.projects as project}
				<a href="/work/{project.slug}" class="project-card">
					<div class="project-image">
						<img src={project.thumbnail} alt={project.title} />
					</div>
					<div class="project-info">
						<h3 class="project-outlet">{project.outlet}</h3>
						<h2 class="project-title">{project.title}</h2>
						<p class="project-description">{project.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		background: #fff;
		color: #1a1a1a;
		line-height: 1.6;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 60px 24px;
	}

	header {
		margin-bottom: 80px;
	}

	.name {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 16px 0;
		letter-spacing: -0.02em;
	}

	.bio {
		font-size: 1.125rem;
		color: #666;
		max-width: 600px;
		margin: 0;
		line-height: 1.7;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 48px 32px;
	}

	.project-card {
		text-decoration: none;
		color: inherit;
		display: block;
		transition: transform 0.2s ease;
	}

	.project-card:hover {
		transform: translateY(-4px);
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.project-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #f5f5f5;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 16px;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.project-info {
		padding: 0 4px;
	}

	.project-outlet {
		font-size: 0.875rem;
		font-weight: 600;
		color: #666;
		margin: 0 0 4px 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.project-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 8px 0;
		line-height: 1.3;
	}

	.project-description {
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.container {
			padding: 40px 20px;
		}

		header {
			margin-bottom: 50px;
		}

		.name {
			font-size: 2rem;
		}

		.bio {
			font-size: 1rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}
</style>
