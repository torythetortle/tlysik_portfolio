<svelte:head>
	<title>About - Tory Lysik</title>
	<meta
		name="description"
		content="About Tory Lysik — data and graphics journalist based in New York City."
	/>
	<link rel="canonical" href="https://tlysik.com/about" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/about" />
	<meta property="og:title" content="About - Tory Lysik" />
	<meta property="og:description" content="About Tory Lysik — data and graphics journalist based in New York City." />
	<meta property="og:image" content="https://tlysik.com/images/headshot.webp" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About - Tory Lysik" />
	<meta name="twitter:description" content="About Tory Lysik — data and graphics journalist based in New York City." />
	<meta name="twitter:image" content="https://tlysik.com/images/headshot.webp" />
</svelte:head>

<div class="page">
	<div class="container">
		<div class="bio">
			<p>
				I'm a data and graphics journalist and web developer based in New York City.
			</p>
			<p>
				Currently, I am a reporter at the Tow Center for Digital Journalism. I am passionate about using data and graphics to uncover the stories that impact lives and build a better world. I love speaking with real human beings, making order from chaos, and figuring out seemingly unsolvable problems. I also care deeply about accessibility — taking insanely complex topics and critical information and making it clear and understandable.
			</p>
			<p>
				My career has sometimes followed a bit of a zigzag path. I've worked at outlets including <a href="https://www.axios.com/results?q=tory%20lysik&sort=2" target="_blank" rel="noopener noreferrer">Axios</a>, <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a>, <a href="https://www.themarshallproject.org/" target="_blank" rel="noopener noreferrer">The Marshall Project</a>, the <a href="https://apnews.com/" target="_blank" rel="noopener noreferrer">Associated Press</a>, and others. My work spans from local and national shoeleather reporting to interactive graphics and tools. The work I've been a part of has received numerous awards, and has been cited in congressional testimony and federal legislation.
			</p>
			<p>
				I love what I do. Whether it's diving down rabbit holes in legal documents, filing the perfect FOIA request, or building detailed maps to surface human rights issues, I thrive in the meticulous, detail-heavy work that makes complex stories click — on tight deadlines or over months.
			</p>
			<p>
				In my free time, I am usually escaping the concrete jungle of NYC for the mountains or trying to become fluent in a fifth language.
			</p>
		</div>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-2xl);
	}

	.bio p {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: var(--color-text);
	}

	.bio p:last-child {
		margin-bottom: 0;
	}

	.bio a {
		font-weight: 600;
	}

	@media (max-width: 480px) {
		.bio p {
			font-size: 1rem;
			line-height: 1.7;
		}
	}
</style>
