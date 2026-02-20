import type { PageServerLoad } from './$types';
import { projects } from '$lib/data/projects';

export const load: PageServerLoad = async () => {
	return { projects };
};
