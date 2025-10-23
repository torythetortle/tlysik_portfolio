<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.project.title} - Tory Lysik</title>
</svelte:head>

<div class="container">
	<nav>
		<a href="/" class="back-link">← Back to portfolio</a>
	</nav>

	<article class="project">
		<header>
			<p class="outlet">{data.project.outlet}</p>
			<h1 class="title">{data.project.title}</h1>
			<p class="description">{data.project.description}</p>
		</header>

		<div class="project-image">
			<img src={data.project.thumbnail} alt={data.project.title} />
		</div>

		<div class="content">
			<section>
				<h2>About this project</h2>
				<p>
					This is where you'd add detailed information about the project. Include:
				</p>
				<ul>
					<li>Your role and responsibilities</li>
					<li>The tools and technologies used</li>
					<li>Key findings or insights</li>
					<li>Impact and reach of the story</li>
					<li>Any challenges you overcame</li>
				</ul>
			</section>

			<section>
				<h2>Process</h2>
				<p>
					Describe your workflow, from data collection to final publication.
					Include any interesting methodological choices or technical approaches.
				</p>
			</section>

			{#if data.project.link}
				<a href={data.project.link} target="_blank" rel="noopener" class="external-link">
					View published story →
				</a>
			{/if}
		</div>
	</article>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 60px 24px;
	}

	nav {
		margin-bottom: 40px;
	}

	.back-link {
		color: #666;
		text-decoration: none;
		font-size: 0.9375rem;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: #1a1a1a;
	}

	.project header {
		margin-bottom: 40px;
	}

	.outlet {
		font-size: 0.875rem;
		font-weight: 600;
		color: #666;
		margin: 0 0 8px 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.title {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 16px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.description {
		font-size: 1.25rem;
		color: #666;
		margin: 0;
		line-height: 1.6;
	}

	.project-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #f5f5f5;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 60px;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: #333;
	}

	.content section {
		margin-bottom: 40px;
	}

	.content h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 16px 0;
		color: #1a1a1a;
	}

	.content p {
		margin: 0 0 16px 0;
	}

	.content ul {
		margin: 16px 0;
		padding-left: 24px;
	}

	.content li {
		margin-bottom: 8px;
	}

	.external-link {
		display: inline-block;
		margin-top: 24px;
		padding: 12px 24px;
		background: #1a1a1a;
		color: #fff;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: background 0.2s ease;
	}

	.external-link:hover {
		background: #333;
	}

	@media (max-width: 768px) {
		.container {
			padding: 40px 20px;
		}

		.title {
			font-size: 2rem;
		}

		.description {
			font-size: 1.125rem;
		}

		.content {
			font-size: 1rem;
		}
	}
</style>
