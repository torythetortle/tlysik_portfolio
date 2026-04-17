<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import HexagonBackground from '$lib/components/HexagonBackground.svelte';

	let { children } = $props();

	const isHome = $derived(page.url.pathname === '/');
</script>

{#if !isHome}
	<HexagonBackground />
{/if}
<div class="content-wrapper" class:full={isHome}>
	{#if !isHome}
		<Navigation />
	{/if}
	<main>
		{@render children()}
	</main>
	{#if !isHome}
		<Footer />
	{/if}
</div>

<style>
	.content-wrapper {
		position: relative;
		z-index: 1;
	}
	main {
		min-height: 0;
	}
</style>
