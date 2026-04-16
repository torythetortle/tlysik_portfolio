<script lang="ts">
	import { browser } from '$app/environment';
	import type { Project } from '$lib/data/projects';

	let { data } = $props();

	let authenticated = $state(browser && sessionStorage.getItem('work-auth') === 'true');
	let passwordInput = $state('');
	let error = $state('');

	function checkPassword() {
		if (passwordInput === '1234') {
			authenticated = true;
			sessionStorage.setItem('work-auth', 'true');
			error = '';
		} else {
			error = 'Incorrect password.';
		}
	}

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function formatDate(dateStr: string): string {
		const [year, month] = dateStr.split('-').map(Number);
		return `${monthNames[month - 1]} ${year}`;
	}

	const categoryOrder = ['Investigations', 'Data & Analysis', 'Visual & Interactive', 'Research'] as const;

	const projectsByCategory = categoryOrder.reduce(
		(acc, category) => {
			const items = [...data.projects]
				.filter((p: Project) => p.category === category)
				.sort((a: Project, b: Project) => b.date.localeCompare(a.date));
			if (items.length > 0) {
				acc.push({ category, projects: items });
			}
			return acc;
		},
		[] as { category: string; projects: Project[] }[]
	);
</script>

<svelte:head>
	<title>Work - Tory Lysik</title>
	<meta
		name="description"
		content="Full portfolio of data journalism, investigations, visual storytelling, and research by Tory Lysik."
	/>
	<link rel="canonical" href="https://tlysik.com/work" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/work" />
	<meta property="og:title" content="Work - Tory Lysik" />
	<meta property="og:description" content="Full portfolio of data journalism, investigations, visual storytelling, and research by Tory Lysik." />
	<meta property="og:image" content="https://tlysik.com/images/headshot.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Work - Tory Lysik" />
	<meta name="twitter:description" content="Full portfolio of data journalism, investigations, visual storytelling, and research by Tory Lysik." />
	<meta name="twitter:image" content="https://tlysik.com/images/headshot.webp" />
</svelte:head>

{#if !authenticated}
	<div class="gate">
		<div class="container">
			<div class="gate-box">
				<p>This page is password protected.</p>
				<form onsubmit={(e) => { e.preventDefault(); checkPassword(); }}>
					<input
						type="password"
						bind:value={passwordInput}
						placeholder="Enter password"
						autocomplete="off"
					/>
					<button type="submit">Enter</button>
				</form>
				{#if error}
					<p class="gate-error">{error}</p>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="page">
		<div class="container">
			<h1>Work</h1>

			{#each projectsByCategory as group}
				<section class="category-group">
					<h2 class="category-heading">{group.category}</h2>
					<div class="card-grid">
						{#each group.projects as project}
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								class="card"
							>
								{#if project.thumbnail}
									<div class="card-image">
										<img src={project.thumbnail} alt="{project.title} — {project.outlet}" loading="lazy" />
									</div>
								{/if}
								<div class="card-body">
									<h3 class="card-title">{project.title}</h3>
									<span class="card-meta">{project.outlet} · {formatDate(project.date)}</span>
									{#if project.awards}
										<span class="card-award">{project.awards}</span>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Password gate */
	.gate {
		padding-top: var(--space-2xl);
	}

	.gate-box {
		max-width: 320px;
	}

	.gate-box p {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.gate-box form {
		display: flex;
		gap: var(--space-xs);
	}

	.gate-box input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		color: var(--color-text-bright);
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}

	.gate-box input:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.gate-box button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		cursor: pointer;
		transition: border-color var(--transition-base), color var(--transition-base);
	}

	.gate-box button:hover {
		border-color: var(--color-accent);
		color: var(--color-text-bright);
	}

	.gate-error {
		color: #e06c75;
		font-size: 0.8125rem;
		margin-top: var(--space-xs);
	}

	/* Work page */
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	h1 {
		font-size: 1.5rem;
		margin-bottom: var(--space-2xl);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.category-group {
		margin-bottom: var(--space-2xl);
	}

	.category-heading {
		font-family: var(--font-mono);
		font-size: 1.125rem;
		color: var(--color-accent);
		margin-bottom: var(--space-lg);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		border: 1px solid var(--color-border);
		overflow: hidden;
		transition: border-color var(--transition-base), transform var(--transition-base);
	}

	.card:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
	}

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--color-bg-subtle);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.85;
		transition: opacity var(--transition-base);
	}

	.card:hover .card-image img {
		opacity: 1;
	}

	.card-body {
		padding: var(--space-sm) var(--space-md);
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.card-title {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-bright);
		line-height: 1.4;
		margin-bottom: 0.5rem;
	}

	.card-meta {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin-top: auto;
	}

	.card-award {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-accent);
		margin-top: 0.375rem;
	}

	@media (max-width: 900px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 560px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
