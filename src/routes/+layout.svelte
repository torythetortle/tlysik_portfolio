<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import HexagonBackground from '$lib/components/HexagonBackground.svelte';
	import Bee from '$lib/components/Bee.svelte';

	let { children } = $props();
</script>

<HexagonBackground />
<div class="content-wrapper">
	<Navigation />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
<Bee />

<style>
	.content-wrapper {
		position: relative;
		z-index: 1;
	}
	main {
		min-height: 0;
	}
</style>
