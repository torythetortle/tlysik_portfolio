<svelte:head>
	<title>Tory Lysik - Journalist</title>
	<meta
		name="description"
		content="Portfolio of Tory Lysik. Data journalist specializing in investigations, computational journalism, and visual storytelling."
	/>
	<link rel="canonical" href="https://tlysik.com/" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tlysik.com/" />
	<meta property="og:title" content="Tory Lysik - Journalist" />
	<meta property="og:description" content="Data journalist specializing in investigations, computational journalism, and visual storytelling." />
	<meta property="og:image" content="https://tlysik.com/images/headshot.png" />
	<meta property="og:site_name" content="Tory Lysik" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tory Lysik - Journalist" />
	<meta name="twitter:description" content="Data journalist specializing in investigations, computational journalism, and visual storytelling." />
	<meta name="twitter:image" content="https://tlysik.com/images/headshot.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Tory Lysik",
		"url": "https://tlysik.com",
		"jobTitle": "Data and Graphics Journalist",
		"worksFor": { "@type": "Organization", "name": "Tow Center for Digital Journalism" },
		"sameAs": [
			"https://github.com/torythetortle"
		],
		"image": "https://tlysik.com/images/headshot.png",
		"description": "Data journalist specializing in investigations, computational journalism, and visual storytelling."
	})}</script>`}
</svelte:head>

<div class="page">
	<div class="container">
		<div class="bio">
			<p>
				I'm a data and graphics journalist and web developer based in New York City. I'm currently a Reporter at the Tow Center for Digital Journalism. I'm passionate about using data and graphics to uncover the stories that impact lives and build a better world. I love actually talking to real human beings, making order from chaos, and figuring out seemingly unsolvable problems. I also care deeply about accessibility — taking insanely complex topics and critical information and making it clear and understandable.
			</p>
			<p>
				My career has sometimes followed a bit of a zigzag path, but I've worked at outlets including <a href="https://www.axios.com/results?q=tory%20lysik&sort=2" target="_blank" rel="noopener noreferrer">Axios</a>, <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a>, <a href="https://www.themarshallproject.org/" target="_blank" rel="noopener noreferrer">The Marshall Project</a>, the <a href="https://apnews.com/" target="_blank" rel="noopener noreferrer">Associated Press</a>, and others. My work spans from local and national shoeleather reporting to interactive graphics and tools, covering topics from AI-generated misinformation and U.S. weapons sales to law enforcement staffing trends. It has been cited in congressional testimony and federal legislation. The work I've been a part of has received numerous awards, including a <a href="https://www.axios.com/local/denver/2024/02/09/emergency-overdose-calls-deaths-rise-fentanyl-polis" target="_blank" rel="noopener noreferrer">data-driven deep dive into how Colorado's fentanyl laws increased overdose deaths</a> due to fears of prison time for calling 911, and an <a href="https://www.axios.com/us-immigration-cities-travel-itinerary" target="_blank" rel="noopener noreferrer">interactive story on the history of small towns and how you can take an international trip without leaving your state</a>.
			</p>
			<p>
				I love what I do. Whether it's diving down rabbit holes in legal documents, filing the perfect FOIA request, or building detailed maps to surface human rights issues, I thrive in the meticulous, detail-heavy work that makes complex stories click — on tight deadlines or over months.
			</p>
			<p>
				In my free time, I'm usually escaping the concrete jungle of NYC for the mountains or trying to become fluent in a fifth language.
			</p>
		</div>
	</div>
</div>

<style>
	.page {
		padding-top: var(--space-lg);
	}

	.bio {
		max-width: none;
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
