import type { PageServerLoad } from './$types';
import { illustrations } from '$lib/data/illustrations';

export const prerender = true;

export const load: PageServerLoad = async () => {
	return { illustrations };
};
