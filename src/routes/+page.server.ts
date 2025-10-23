import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Your portfolio projects - add your real projects here!
	const projects = [
		{
			slug: 'us-weapons-israel',
			outlet: 'Axios',
			title: 'U.S. weapons provided to Israel',
			description: 'Tracking aircraft, missiles, and bombs sent to Israel during the conflict',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=US+Weapons+Israel'
		},
		{
			slug: 'law-enforcement-employment',
			outlet: 'Axios',
			title: 'Police and government employment data',
			description: 'Analysis of local and national law enforcement employment declines',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Law+Enforcement'
		},
		{
			slug: 'data-visualization-project',
			outlet: 'Personal Project',
			title: 'Interactive data visualization',
			description: 'Exploring trends in public data through interactive graphics',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Data+Viz'
		},
		{
			slug: 'ai-research-paper',
			outlet: 'Research',
			title: 'AI in journalism research',
			description: 'Studying the impact of AI tools on investigative reporting',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=AI+Research'
		},
		{
			slug: 'climate-data-story',
			outlet: 'Axios',
			title: 'Climate data storytelling',
			description: 'Visual analysis of climate trends and their local impacts',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Climate+Data'
		},
		{
			slug: 'election-coverage',
			outlet: 'Axios',
			title: 'Election results dashboard',
			description: 'Real-time tracking and analysis of election results',
			thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Elections'
		}
	];

	return {
		projects
	};
};
