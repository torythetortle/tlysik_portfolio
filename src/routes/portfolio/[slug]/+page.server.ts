import type { PageServerLoad } from './$types';
import { projects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const project = projects.find((p) => p.slug === params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return { project };
};

export const entries = () => {
	return projects.map((p) => ({ slug: p.slug }));
};
