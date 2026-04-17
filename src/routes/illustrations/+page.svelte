<script lang="ts">
	import { onMount } from 'svelte';
	import type { Illustration } from '$lib/data/illustrations';

	let { data } = $props();

	interface Piece {
		file: string;
		x: number;
		y: number;
		rotation: number;
		width: number;
		z: number;
	}

	const STORAGE_KEY = 'illustrations-layout-v2';

	let pieces = $state<Piece[]>([]);
	let topZ = $state(1);
	let canvasEl: HTMLDivElement;
	let draggingIndex = $state<number | null>(null);
	let dragStart = $state<{ x: number; y: number } | null>(null);
	let wasDragged = $state(false);
	let selectedFile = $state<string | null>(null);
	let offsetX = 0;
	let offsetY = 0;

	function seedLayout(items: Illustration[]): Piece[] {
		const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const usableW = Math.min(vw - 40, 1200);

		return items.map((ill, i) => {
			const width = 180 + Math.random() * 140;
			const cols = Math.max(2, Math.min(4, Math.floor(usableW / 260)));
			const col = i % cols;
			const row = Math.floor(i / cols);
			const cellW = usableW / cols;
			const cellH = 280;
			const jitterX = (Math.random() - 0.5) * cellW * 0.5;
			const jitterY = (Math.random() - 0.5) * 80;
			return {
				file: ill.file,
				x: col * cellW + cellW / 2 - width / 2 + jitterX + 20,
				y: row * cellH + jitterY + 20,
				rotation: (Math.random() - 0.5) * 20,
				width,
				z: i + 1
			};
		});
	}

	const illMap = $derived(new Map(data.illustrations.map((i: Illustration) => [i.file, i])));
	const selected = $derived(selectedFile ? illMap.get(selectedFile) : null);

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved) as Piece[];
				const byFile = new Map(parsed.map((p) => [p.file, p]));
				const seeded = seedLayout(data.illustrations);
				pieces = seeded.map((p) => byFile.get(p.file) ?? p);
				topZ = Math.max(...pieces.map((p) => p.z), 1);
			} catch {
				pieces = seedLayout(data.illustrations);
			}
		} else {
			pieces = seedLayout(data.illustrations);
		}
	});

	function savePositions() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(pieces));
		} catch {}
	}

	function onPointerDown(e: PointerEvent, i: number) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
		draggingIndex = i;
		dragStart = { x: e.clientX, y: e.clientY };
		wasDragged = false;
		topZ += 1;
		pieces[i].z = topZ;
		target.setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function onPointerMove(e: PointerEvent) {
		if (draggingIndex === null || !dragStart) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDragged = true;
		const canvasRect = canvasEl.getBoundingClientRect();
		pieces[draggingIndex].x = e.clientX - canvasRect.left - offsetX;
		pieces[draggingIndex].y = e.clientY - canvasRect.top - offsetY;
	}

	function onPointerUp(e: PointerEvent, i: number) {
		if (draggingIndex === null) return;
		const target = e.currentTarget as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		draggingIndex = null;
		dragStart = null;
		savePositions();
		if (!wasDragged) {
			selectedFile = pieces[i].file;
		}
	}

	function resetLayout() {
		pieces = seedLayout(data.illustrations);
		topZ = pieces.length;
		savePositions();
	}

	function closeDetail() {
		selectedFile = null;
	}

	function onKeyClose(e: KeyboardEvent) {
		if (e.key === 'Escape') closeDetail();
	}
</script>

<svelte:head>
	<title>Illustrations - Tory Lysik</title>
	<meta name="description" content="Illustrations and art by Tory Lysik." />
	<link rel="canonical" href="https://tlysik.com/illustrations" />
</svelte:head>

<svelte:window on:keydown={onKeyClose} />

<div class="page">
	<div class="container intro">
		<p class="hint">
			Drag pieces to rearrange — click one to see the story.
			<button class="reset" onclick={resetLayout}>reset</button>
		</p>
	</div>

	<div class="canvas" bind:this={canvasEl}>
		{#if pieces.length === 0}
			<p class="empty">No illustrations yet.</p>
		{/if}
		{#each pieces as piece, i (piece.file)}
			<div
				class="piece"
				class:dragging={draggingIndex === i}
				style="transform: translate({piece.x}px, {piece.y}px) rotate({piece.rotation}deg); width: {piece.width}px; z-index: {piece.z};"
				onpointerdown={(e) => onPointerDown(e, i)}
				onpointermove={onPointerMove}
				onpointerup={(e) => onPointerUp(e, i)}
				onpointercancel={(e) => onPointerUp(e, i)}
				role="button"
				tabindex="0"
				aria-label={illMap.get(piece.file)?.title ?? piece.file}
			>
				<img src={`/illustrations/${piece.file}`} alt={illMap.get(piece.file)?.title ?? piece.file} draggable="false" loading="lazy" />
			</div>
		{/each}
	</div>
</div>

{#if selected}
	<div
		class="overlay"
		onclick={closeDetail}
		onkeydown={onKeyClose}
		role="button"
		tabindex="-1"
		aria-label="Close details"
	>
		<div class="detail" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
			<button class="close" onclick={closeDetail} aria-label="Close">×</button>
			<div class="detail-image">
				<img src={`/illustrations/${selected.file}`} alt={selected.title} />
			</div>
			<div class="detail-body">
				<h2>{selected.title}</h2>
				{#if selected.description}
					<p class="description">{selected.description}</p>
				{/if}
				{#if selected.tags.length > 0}
					<p class="tags">{selected.tags.join(' / ')}</p>
				{/if}
				{#if selected.link}
					<a href={selected.link} target="_blank" rel="noopener noreferrer" class="external">
						Read more ↗
					</a>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.page {
		padding-top: var(--space-md);
		padding-bottom: var(--space-2xl);
	}

	.intro {
		margin-bottom: var(--space-md);
	}

	.hint {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.reset {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		margin-left: 0.5rem;
		cursor: pointer;
		transition: border-color var(--transition-base), color var(--transition-base);
	}

	.reset:hover {
		border-color: var(--color-accent);
		color: var(--color-text-bright);
	}

	.canvas {
		position: relative;
		width: 100%;
		min-height: 80vh;
		touch-action: none;
	}

	.empty {
		text-align: center;
		font-family: var(--font-mono);
		color: var(--color-text-muted);
		padding-top: 4rem;
	}

	.piece {
		position: absolute;
		top: 0;
		left: 0;
		cursor: grab;
		touch-action: none;
		user-select: none;
		transition: filter 0.2s ease;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
	}

	.piece:hover {
		filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.6));
	}

	.piece.dragging {
		cursor: grabbing;
		filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.7));
	}

	.piece img {
		width: 100%;
		height: auto;
		display: block;
		pointer-events: none;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-lg);
		backdrop-filter: blur(4px);
	}

	.detail {
		background: var(--color-bg-subtle);
		border: 1px solid var(--color-border);
		max-width: 720px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: auto;
		position: relative;
	}

	.close {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: 1.75rem;
		cursor: pointer;
		line-height: 1;
		padding: 0.25rem 0.5rem;
		z-index: 1;
	}

	.close:hover {
		color: var(--color-text-bright);
	}

	.detail-image {
		background: var(--color-bg);
		padding: var(--space-lg);
		display: flex;
		justify-content: center;
	}

	.detail-image img {
		max-width: 100%;
		max-height: 400px;
		height: auto;
	}

	.detail-body {
		padding: var(--space-lg);
	}

	.detail-body h2 {
		margin: 0 0 var(--space-sm);
		color: var(--color-text-bright);
	}

	.description {
		color: var(--color-text);
		margin-bottom: var(--space-md);
	}

	.tags {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.external {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-accent);
		text-decoration: underline;
	}

	.external:hover {
		color: var(--color-accent-hover);
	}
</style>
