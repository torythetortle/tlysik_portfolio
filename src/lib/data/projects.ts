export interface Project {
	slug: string;
	outlet: string;
	title: string;
	description: string;
	thumbnail: string;
	link: string;
	additionalLinks?: { label: string; url: string }[];
	date: string;
	tags: string[];
	collaborators: string[];
	awards: string;
	featured: boolean;
	category: 'Investigations' | 'Data & Analysis' | 'Visual & Interactive' | 'Research';
}

export const projects: Project[] = [
	{
		slug: 'annotation-highlight-tool',
		outlet: 'Tow Center for Digital Journalism',
		title: 'Annotation and highlighting tool',
		description:
			'Built a browser-based annotation tool for internal use. Used to cleanly show and systematically mark up multi-page text in any file format — color-coding and tagging headlines, fact-checking information, and linking quotes to sources. Built with React, pdf.js, and a custom SVG overlay system handling cross-page arrow routing and annotation merging. Used regularly to produce structured datasets to test AI and algorithm-focused tools. Usable in mobile or web.',
		thumbnail: '/images/highlighttool.png',
		link: '',
		date: '2026-01-01',
		tags: ['react', 'pdf.js', 'AI', 'javascript', 'Vite', 'NLPs'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Research'
	},
	{
		slug: 'use-case-crypto-magazine',
		outlet: 'Use Case Magazine',
		title: 'Crypto magazine data analysis and visualizations',
		description:
			'Led the creation and reporting of data graphics, visual explainers, and data analysis for the first and second editions of Use Case, an international crypto magazine. Emphasis on building stories accessible on print, web, and mobile.',
		thumbnail: '/images/usecase.png',
		link: 'https://www.usecase.xyz/',
		date: '2025-11-01',
		tags: ['Adobe Illustrator', 'Photoshop', 'Procreate', 'data analysis', 'UI', 'print design', 'HTML'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Visual & Interactive'
	},
	{
		slug: 'disney-streaming-profit',
		outlet: 'Axios',
		title: "Disney's entertainment streaming business posts first-time profit",
		description:
			'Breaking news story on quarterly profits for Disney. Numbers initially were reported incorrectly from the company and I caught it. Worked quickly to fact-check, recheck with the company, analyze the data and translate to the reporters on the ground, and create the visualization.',
		thumbnail: '/images/disney.png',
		link: 'https://www.axios.com/2024/05/07/disney-entertainment-streaming-profit-earnings',
		date: '2024-05-07',
		tags: ['financial analysis', 'Python', 'Datawrapper', 'AI', 'HTML', 'mobile sizing'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'super-bowl-asl',
		outlet: 'Axios',
		title: 'Super Bowl broadcasts have mixed history of screen time for sign language performers',
		description:
			'Built a custom computer vision model in Python to measure on-screen time for ASL performers across decades of Super Bowl footage. The analysis revealed most performances received just 7 seconds of airtime, which was against FCC policy, leading the NFL to implement changes.',
		thumbnail: '/images/superbowl.png',
		link: 'https://www.axios.com/2024/02/09/super-bowl-deaf-asl-sign-language-performer',
		date: '2024-02-09',
		tags: ['svelte', 'python', 'data visualization', 'OSINT'],
		collaborators: ['Shoshana Gordon', 'Maura Kearns'],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'vox-veterans-bill',
		outlet: 'Vox',
		title: 'Senate Republicans threatened to burn a bill that would have helped veterans',
		description:
			'Reported on Capitol Hill and spoke with veteran activists protesting Republican senators blocking healthcare legislation. Conducted on-the-ground interviews with veterans, congressional staffers, and policy experts under tight deadlines.',
		thumbnail: '/images/burnpits.png',
		link: 'https://www.vox.com/2022/7/30/23284976/senate-republicans-pact-act-veterans',
		date: '2022-07-30',
		tags: ['data reporting', 'politics', 'Washington', 'NLPs'],
		collaborators: ['Li Zhou'],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'atl-brian-kemp',
		outlet: 'Axios',
		title: 'The Making of Brian Kemp',
		description:
			'Analyzed years of Georgia campaign finance records using Python and a custom-built PDF analyzing tool to trace Governor Brian Kemp\'s political and financial evolution, including the unprecedented $28.7 million he raised in a single quarter.',
		thumbnail: '/images/briankemp.png',
		link: 'https://www.axios.com/local/atlanta/2022/10/21/the-making-of-brian-kemp',
		date: '2022-10-21',
		tags: ['data reporting', 'finance', 'politics', 'elections', 'finance/budget analysis'],
		collaborators: ['Emma Hurt'],
		awards: 'Georgia Press Association: 2022 Best Newsletter and Profile Story',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'denver-overdose-fentanyl',
		outlet: 'Axios',
		title: 'In Denver a controversial bill caused overdose deaths to rise while emergency calls fell',
		description:
			'Used R for statistical analysis and geospatial mapping to visualize neighborhood-level overdose patterns across Denver, revealing a 27% drop in emergency calls while deaths climbed. State lawmakers cited our findings in proposed amendments to the legislation. Data was gathered via FOIA requests, and maps were created using GIS and ArcGIS.',
		thumbnail: '/images/denveroverdose.png',
		link: 'https://www.axios.com/local/denver/2024/02/09/emergency-overdose-calls-deaths-rise-fentanyl-polis',
		date: '2024-02-09',
		tags: ['QGIS', 'ArcGIS', 'Python', 'UI', 'R', 'Mapbox', 'APIs', 'Geocoding', 'FOIA'],
		collaborators: ['Esteban Hernandez'],
		awards: 'Colorado Press Association: Best Infographics & Best Newsletter of 2024',
		featured: true,
		category: 'Investigations'
	},
	{
		slug: 'epa-rmp-series',
		outlet: 'Axios',
		title: 'At risk series: Mapping facilities that house dangerous chemicals',
		description:
			'Built a living, first-of-its-kind interactive national database of ~12,000 facilities storing dangerous chemicals from FOIA-obtained EPA records using SQL, Python, and interactive Mapbox mapping. Identified nearly 4,000 reported accidents since 2003. Led and produced stories across multiple Axios local and national desks. Spoke with those on the ground affected by spills that were never reported to them, nor did they have knowledge of why they were harmed.',
		thumbnail: '/images/eparmp.png',
		link: 'https://www.axios.com/hazardous-chemicals-US-near-you-data',
		additionalLinks: [
			{ label: 'Part 2', url: 'https://www.axios.com/2023/09/22/chemicals-accidents-epa-ammonia-chlorine' }
		],
		date: '2023-06-01',
		tags: ['SQL', 'web development', 'react', 'svelte', 'Mapbox', 'R', 'APIs', 'web scraping', 'FOIA', 'UI', 'Cartography', 'responsive design', 'CSS', 'Tailwind'],
		collaborators: ['Thomas Oide', 'Will Chase', 'Tina Reed', 'Jared Whalen'],
		awards: '',
		featured: true,
		category: 'Investigations'
	},
	{
		slug: 'gun-violence-annual',
		outlet: 'Axios',
		title: "School gun violence torments America's youngest generation",
		description:
			"Part of a multi-story series on gun violence among children and teens. Built custom Python scrapers to collect incident data and cross-validated against the K-12 School Shooting Database. Used statistical modeling and geospatial analysis to visualize regional patterns and the rise in school gun incidents since 2018.",
		thumbnail: '/images/shootings.png',
		link: 'https://www.axios.com/2023/05/20/gun-violence-children-schools',
		additionalLinks: [
			{ label: 'School counselors shortage', url: 'https://www.axios.com/2024/05/26/school-counselors-shortage-inequality-midwest-west' }
		],
		date: '2023-05-20',
		tags: ['Datawrapper', 'Python', 'UI', 'web scraping', 'data analysis'],
		collaborators: ['Erin Doherty'],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'student-protesters-map',
		outlet: 'Axios',
		title: 'Where pro-Palestinian student protesters have been arrested',
		description:
			"Led Axios' breaking news coverage of the pro-Palestine encampments taking place across the United States over multiple weeks. Reported multiple stories with custom data visualizations, including a map of U.S. encampments and arrests. Advised on safety for reporters on the ground while fact-checking and publishing breaking stories that regularly beat other major news outlets.",
		thumbnail: '/images/encampment.png',
		link: 'https://www.axios.com/2024/04/27/palestinian-college-protest-arrest-encampment',
		date: '2024-05-01',
		tags: ['Cartography', 'OSINT', 'safety', 'web scraping', 'JavaScript', 'Svelte', 'QGIS', 'interactive design', 'Three.js', 'color theory'],
		collaborators: ['April Rubin', 'Kavya Beheraj', 'Will Chase'],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'ukraine-pow-attack',
		outlet: 'Vox',
		title: 'The attack on a prison holding Ukraine POWs, explained',
		description:
			'Traveled to Ukraine and used OSINT techniques including geolocation analysis, satellite imagery review, and social media cross-referencing to investigate conflicting accounts of the Olenivka prison attack that killed 53 POWs.',
		thumbnail: '/images/voxpows.png',
		link: 'https://www.vox.com/2022/7/31/23286026/attack-prison-holding-ukraine-pows-explained-russia',
		date: '2022-07-31',
		tags: ['data reporting', 'politics', 'Washington'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Investigations'
	},
	{
		slug: 'biden-travel-visualized',
		outlet: 'Axios',
		title: "Biden's travel schedule is lighter than almost all other U.S. presidents",
		description:
			'Built a comprehensive database of each president\'s campaign travel by synthesizing multiple data sources including publicly available flight logs, Freedom of Information Act requests, and White House schedules. Collaborated with U.S. Naval Academy professor Brendan Doherty\u2014author of "The Rise of the President\'s Permanent Campaign"\u2014to cross-reference and verify the dataset against academic research standards.\n\nThe data collection required establishing consistent methodology for what constituted "campaign travel" versus official duties, excluding trips to Maryland, D.C., Virginia, and home cities unless election events occurred. Created an interactive visualization in Svelte showing Biden held 90 domestic events through June 30\u2014outpacing Trump\'s pandemic-limited 50 events in the same 2020 period, but trailing Obama\'s 2012 pace. Used ai2html to produce accessible static versions edited in Adobe Illustrator for broader distribution.',
		thumbnail: '/images/biden.png',
		link: 'https://www.axios.com/2024/07/07/biden-light-election-year-travel-schedule-2024',
		date: '2024-07-07',
		tags: ['adobe illustrator', 'svelte', 'data reporting', 'politics', 'finance/budget analysis'],
		collaborators: ['Hans Nichols'],
		awards: '',
		featured: false,
		category: 'Data & Analysis'
	},
	{
		slug: 'no-passport-problem',
		outlet: 'Axios',
		title: 'No passport? No problem',
		description:
			'Built a React-based interactive experience with custom Mapbox maps letting users explore U.S. towns named after foreign places. Analyzed geographic data in R to surface immigrant settlement patterns across the country.',
		thumbnail: '/images/paristexas.png',
		link: 'https://www.axios.com/us-immigration-cities-travel-itinerary',
		date: '2024-01-15',
		tags: ['D3', 'svelte', 'react', 'R', 'node.js', 'UI design', 'Cartography', 'responsive design', 'CSS', 'Tailwind'],
		collaborators: ['Will Chase', 'Jacque Schrag'],
		awards: 'Information is Beautiful Awards: 2023 Finalist',
		featured: true,
		category: 'Visual & Interactive'
	},
	{
		slug: 'police-jobs-loss',
		outlet: 'Marshall Project',
		title: "It\u2019s not just a police problem, Americans are opting out of government jobs",
		description:
			'Filed FOIA requests and merged Census Bureau and BLS payroll datasets in Python to build a national database tracking public-sector employment across hundreds of cities. Led a cross-newsroom collaboration between The Marshall Project and Axios.',
		thumbnail: '/images/marshallproject.png',
		link: 'https://www.themarshallproject.org/2023/01/21/police-hiring-government-jobs-decline',
		date: '2023-01-21',
		tags: ['investigation', 'data reporting', 'react', 'python', 'algorithmic accountability'],
		collaborators: ['Daphne Duret', 'Weihua Li'],
		awards: '',
		featured: true,
		category: 'Investigations'
	},
	{
		slug: 'marshall-project-election-survey',
		outlet: 'Marshall Project',
		title: "We surveyed 54,000 people behind bars about the election",
		description:
			'Led the data analysis for a survey of over 54,000 incarcerated respondents across 45 states examining political preferences and voting access behind bars. Data analysis was conducted using cloud-native data pipelines and ETL tools. The survey found roughly half would vote for Trump, with 61% support among White incarcerated people, while 35% identified as independent. The project included a journalist toolkit with downloadable state-level data to help newsrooms localize the findings.',
		thumbnail: '/images/surveyTMP.png',
		link: 'https://www.themarshallproject.org/2024/10/17/election-voting-harris-trump-incarceration-poll',
		additionalLinks: [
			{ label: 'Journalist toolkit', url: 'https://www.themarshallproject.org/2024/10/18/journalism-election-survey-prisons-jails-voting' }
		],
		date: '2025-04-01',
		tags: ['Dagster', 'ETL', 'Python', 'Observable', 'Adobe Illustrator', 'NLPs', 'AI'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Data & Analysis'
	},
	{
		slug: 'cherry-blossoms-climate-change',
		outlet: 'Axios',
		title: 'Cherry blossoms bloom earlier\u2014then face deadly frosts',
		description:
			"Pitched and produced one of Axios's first comic strip stories, using Adobe Illustrator animations and Svelte graphics to visualize climate data showing DC cherry blossom bloom dates shifting six days earlier over the past century.",
		thumbnail: '/images/cherryblossoms.jpg',
		link: 'https://www.instagram.com/axios/p/C5bRCihrI6N/?img_index=1',
		date: '2024-04-01',
		tags: ['local reporting', 'adobe illustrator', 'data reporting', 'environmental', 'color theory'],
		collaborators: ['A\u00efda Amer', 'Andrew Freedman'],
		awards: '',
		featured: true,
		category: 'Visual & Interactive'
	},
	{
		slug: 'politics-tiktok-cjr',
		outlet: 'Columbia Journalism Review',
		title: 'Where the White House is leading us with TikTok',
		description:
			"Used Python scrapers, machine learning image analysis models, and an NLP sentiment analysis system to track the White House TikTok account's engagement metrics, visual use, and text meaning to understand the strategy behind the account. Data was analyzed using descriptive and diagnostic methods. The top comment on 97 of 101 videos was negative despite 1.4 million followers.",
		thumbnail: '/images/tiktok.png',
		link: 'https://www.cjr.org/analysis/tiktok-white-house-press-ellison-trump-yass-murdoch.php',
		date: '2025-12-01',
		tags: [
			'social media analysis',
			'python',
			'LLMs',
			'NLPs',
			'disinformation',
			'algorithmic accountability'
		],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Research'
	},
	{
		slug: 'drought-conditions-annual-bad',
		outlet: 'Axios',
		title: 'Drought just hit a 3-year low. Here is how that is a bad thing in four maps.',
		description:
			'Reported and visualized U.S. drought data for a social-first story showing that only 35% of the lower 48 states experienced drought leading up to Earth Day 2023\u2014the lowest in three years\u2014while contextualizing the ongoing crisis in the Colorado River Basin. Built the drought map in R with data analysis in Python, prioritizing color accessibility and design for colorblind readers to ensure the data was immediately understandable across platforms.',
		thumbnail: '',
		link: 'https://www.axios.com/2023/04/22/drought-winter-colorado-river',
		date: '2023-04-22',
		tags: ['environmental', 'mapping', 'svelte', 'R', 'data visualization'],
		collaborators: [],
		awards: '',
		featured: false,
		category: 'Data & Analysis'
	},
	{
		slug: 'gop-biden-debate-trump-2023',
		outlet: 'Axios',
		title: 'How GOP candidates treated Biden and Trump at the first debate',
		description:
			"Led Axios's live coverage of the first 2024 Republican presidential debate, providing real-time text updates, fact-checking, and sentiment analysis of candidates' statements. Pre-built a custom Python sentiment analysis model using Hugging Face to track the emotional tone of candidates' responses throughout the debate, allowing readers to see not just what was said, but how it was delivered.\nThe coverage required simultaneously monitoring the debate, verifying claims against established facts with source links, and integrating automated sentiment scoring\u2014all under live deadline pressure. The multi-layered approach gave readers unprecedented insight into both the substance and tone of the contentious Milwaukee debate.",
		thumbnail: '',
		link: 'https://www.axios.com/2023/08/24/gop-debate-attacks-trump-biden',
		date: '2023-08-24',
		tags: ['politics', 'data reporting', 'D3', 'finance/budget analysis'],
		collaborators: ['Simran Parawani', 'Shauneen Miranda'],
		awards: '',
		featured: false,
		category: 'Data & Analysis'
	},
	{
		slug: 'eu-migration-backlash',
		outlet: 'Axios',
		title: 'Millions sought asylum in 2022 but now countries are closing their doors',
		description:
			'Rapidly reported and visualized breaking UN data showing 2.9 million asylum applications in 2022\u2014the highest number since UNHCR began tracking in 2000. When the dataset dropped days earlier than expected, I pivoted quickly to analyze global migration patterns and interview policy experts, producing the story on an accelerated timeline. The piece identified that 40% of applications came from Latin America and the Caribbean, contextualizing a historic surge driving political debates across the U.S. and Europe.',
		thumbnail: '',
		link: 'https://www.axios.com/2023/07/16/record-migration-backlash-us-europe',
		date: '2023-07-16',
		tags: ['data visualization', 'international', 'immigration'],
		collaborators: ['Stef Knight'],
		awards: '',
		featured: false,
		category: 'Data & Analysis'
	},
	{
		slug: 'weapons-us-trade-israel-war',
		outlet: 'Axios',
		title: "Inside America's 70-year arms pipeline to Israel",
		description:
			'Analyzed 70+ years of arms transfer data with Python and built an interactive Svelte visualization with custom Adobe Illustrator components to map U.S. military aid to Israel from 1950 to 2023.',
		thumbnail: '/images/armsisrael.png',
		link: 'https://www.axios.com/2023/11/29/us-weapons-provided-israel-aircraft-missiles-bombs',
		date: '2023-11-29',
		tags: ['Svelte', 'Python', 'ai2html', 'FOIA'],
		collaborators: ['Shoshana Gordon'],
		awards: '',
		featured: true,
		category: 'Visual & Interactive'
	},
	{
		slug: 'coral-bleaching-reefs-bad',
		outlet: 'Axios',
		title: '500 million people depend on reefs for survival. The next El Ni\u00f1o could kill that coral off completely',
		description:
			"One of Axios's first social-first comic strip-style stories, blending data journalism with hand-painted visual elements. I secured early access to a study showing that coral bleaching severity was significantly underreported compared to reality, and worked with the research to translate complex climate science into an accessible visual format. Visual elements were hand-painted, scanned, and edited in Adobe Illustrator to create an engaging, shareable story format that reached audiences beyond traditional news consumers.",
		thumbnail: '',
		link: 'https://www.axios.com/2023/07/01/el-nino-coral-reefs-bleaching',
		date: '2023-07-01',
		tags: ['environmental', 'adobe illustrator', 'data visualization'],
		collaborators: ['Erin Davis'],
		awards: '',
		featured: false,
		category: 'Visual & Interactive'
	},
	{
		slug: 'denver-central-70',
		outlet: 'Denver Gazette/Colorado Politics',
		title: 'Denver\u2019s Central 70 project: Digging in troubled ground',
		description:
			"Pitched and led the Denver Gazette's first long-form investigation, analyzing health data from FOIA requests and consulting scientists studying cancer clusters in one of the nation's most polluted ZIP codes. Also collaborated with the University of Colorado to conduct independent air quality studies and have them analyzed by scientists. Conducted months of on-the-ground reporting, primarily in Spanish.",
		thumbnail: '/images/denver70.jpg',
		link: 'https://gazette.com/2021/01/09/denvers-central-70-project-digging-in-troubled-ground-ed4fe09c-4eb9-11eb-806d-6fad58e688fd/',
		date: '2021-01-09',
		tags: ['politics', 'environmental', 'local reporting'],
		collaborators: ['Christian Murdock'],
		awards:
			'Colorado Press Association: Best Investigative Story and Best Editorial Collaboration of 2021',
		featured: true,
		category: 'Investigations'
	},
	{
		slug: 'ai-source-audits',
		outlet: 'Columbia Journalism Review',
		title: 'Toward AI-powered source audits',
		description:
			'Part of a series of articles updating a long-term project focused on auditing historical war and conflict news coverage using AI deep learning and generative model engineering to detect quotes and understand representation and bias in journalism through computational methods.',
		thumbnail: '/images/sourceaudits.png',
		link: 'https://www.cjr.org/tow_center/toward-ai-powered-source-audits.php',
		date: '2025-10-01',
		tags: ['AI', 'LLMs', 'python', 'research', 'algorithmic accountability'],
		collaborators: [],
		awards: '',
		featured: true,
		category: 'Research'
	},
	{
		slug: 'coal-plants-shutdown',
		outlet: 'Axios',
		title: "Coal's influence on energy generation is fading fast",
		description:
			'Analyzed and visualized data on coal plant closures across the United States, showing how coal\u2019s share of energy generation has declined rapidly as utilities shift toward natural gas and renewables. The piece contextualized the economic and environmental implications of the ongoing energy transition.',
		thumbnail: '/images/coal.png',
		link: 'https://www.axios.com/2024/02/21/coal-plants-shutdown',
		date: '2024-02-21',
		tags: ['data visualization', 'environmental', 'data reporting'],
		collaborators: [],
		awards: '',
		featured: false,
		category: 'Data & Analysis'
	},
];
