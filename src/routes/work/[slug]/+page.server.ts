import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// This would ideally come from a database or CMS
const projects = [
	{
		slug: 'us-weapons-israel',
		outlet: 'Axios',
		title: 'U.S. weapons provided to Israel',
		description: 'Tracking aircraft, missiles, and bombs sent to Israel during the conflict',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=US+Weapons+Israel',
		link: 'https://www.axios.com/2023/11/29/us-weapons-provided-israel-aircraft-missiles-bombs'
	},
	{
		slug: 'law-enforcement-employment',
		outlet: 'Axios',
		title: 'Police and government employment data',
		description: 'Analysis of local and national law enforcement employment declines',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Law+Enforcement',
		link: 'https://www.axios.com/2023/01/21/police-government-employee-data'
	},
	{
		slug: 'data-visualization-project',
		outlet: 'Personal Project',
		title: 'Interactive data visualization',
		description: 'Exploring trends in public data through interactive graphics',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Data+Viz',
		link: ''
	},
	{
		slug: 'ai-research-paper',
		outlet: 'Research',
		title: 'AI in journalism research',
		description: 'Studying the impact of AI tools on investigative reporting',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=AI+Research',
		link: ''
	},
	{
		slug: 'climate-data-story',
		outlet: 'Axios',
		title: 'Climate data storytelling',
		description: 'Visual analysis of climate trends and their local impacts',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Climate+Data',
		link: ''
	},
	{
		slug: 'election-coverage',
		outlet: 'Axios',
		title: 'Election results dashboard',
		description: 'Real-time tracking and analysis of election results',
		thumbnail: 'https://placehold.co/800x450/e3e3e3/666?text=Elections',
		link: ''
	}
];

export const load: PageServerLoad = async ({ params }) => {
	const project = projects.find(p => p.slug === params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};
