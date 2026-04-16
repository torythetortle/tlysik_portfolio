<script lang="ts">
	import { onMount } from 'svelte';

	let frogEl: HTMLDivElement;
	let x = $state(0);
	let y = $state(0);
	let dragging = $state(false);
	let blinking = $state(false);
	let pupilX = $state(0);
	let pupilY = $state(0);

	let offsetX = 0;
	let offsetY = 0;

	const STORAGE_KEY = 'frog-position';
	const SIZE = 64;

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const pos = JSON.parse(saved);
				x = clampX(pos.x);
				y = clampY(pos.y);
			} catch {
				setDefaultPosition();
			}
		} else {
			setDefaultPosition();
		}

		const blinkInterval = setInterval(() => {
			if (Math.random() < 0.5) {
				blink();
			}
		}, 3500);

		const lookInterval = setInterval(() => {
			if (!dragging && Math.random() < 0.6) {
				const angle = Math.random() * Math.PI * 2;
				const dist = 2 + Math.random() * 1.5;
				pupilX = Math.cos(angle) * dist;
				pupilY = Math.sin(angle) * dist;
				setTimeout(() => {
					pupilX = 0;
					pupilY = 0;
				}, 900 + Math.random() * 1200);
			}
		}, 4000);

		const handleResize = () => {
			x = clampX(x);
			y = clampY(y);
		};
		window.addEventListener('resize', handleResize);

		return () => {
			clearInterval(blinkInterval);
			clearInterval(lookInterval);
			window.removeEventListener('resize', handleResize);
		};
	});

	function setDefaultPosition() {
		x = window.innerWidth - SIZE - 24;
		y = window.innerHeight - SIZE - 24;
	}

	function clampX(v: number) {
		return Math.max(8, Math.min(window.innerWidth - SIZE - 8, v));
	}

	function clampY(v: number) {
		return Math.max(8, Math.min(window.innerHeight - SIZE - 8, v));
	}

	function blink() {
		blinking = true;
		setTimeout(() => {
			blinking = false;
		}, 150);
	}

	function savePosition() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		const rect = frogEl.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
		frogEl.setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		x = clampX(e.clientX - offsetX);
		y = clampY(e.clientY - offsetY);
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		frogEl.releasePointerCapture(e.pointerId);
		savePosition();
	}

	function onClick() {
		if (!dragging) blink();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			blink();
		}
	}
</script>

<div
	bind:this={frogEl}
	class="frog"
	class:dragging
	style="transform: translate({x}px, {y}px);"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	onclick={onClick}
	onkeydown={onKeyDown}
	role="button"
	tabindex="0"
	aria-label="Draggable frog companion"
>
	<svg viewBox="0 0 64 64" width={SIZE} height={SIZE} aria-hidden="true">
		<ellipse cx="32" cy="54" rx="20" ry="3" fill="rgba(0,0,0,0.25)" />

		<ellipse cx="32" cy="42" rx="22" ry="14" fill="#a8c8b5" />
		<ellipse cx="32" cy="44" rx="16" ry="8" fill="#c9e0d1" opacity="0.5" />

		<ellipse cx="18" cy="48" rx="6" ry="4" fill="#a8c8b5" />
		<ellipse cx="46" cy="48" rx="6" ry="4" fill="#a8c8b5" />

		<circle cx="20" cy="26" r="9" fill="#a8c8b5" />
		<circle cx="44" cy="26" r="9" fill="#a8c8b5" />

		<circle cx="20" cy="26" r="6" fill="#ffffff" />
		<circle cx="44" cy="26" r="6" fill="#ffffff" />

		{#if blinking}
			<rect x="14" y="24" width="12" height="2.5" fill="#4a7a48" rx="1" />
			<rect x="38" y="24" width="12" height="2.5" fill="#4a7a48" rx="1" />
		{:else}
			<circle cx={20 + pupilX} cy={26 + pupilY} r="3" fill="#1a1a1a" />
			<circle cx={44 + pupilX} cy={26 + pupilY} r="3" fill="#1a1a1a" />
			<circle cx={21 + pupilX} cy={25 + pupilY} r="1" fill="#ffffff" />
			<circle cx={45 + pupilX} cy={25 + pupilY} r="1" fill="#ffffff" />
		{/if}

		<path
			d="M 24 44 Q 32 48 40 44"
			stroke="#3d5a3a"
			stroke-width="1.5"
			fill="none"
			stroke-linecap="round"
		/>

		<circle cx="26" cy="44" r="1.2" fill="#d08aa8" opacity="0.5" />
		<circle cx="38" cy="44" r="1.2" fill="#d08aa8" opacity="0.5" />
	</svg>
</div>

<style>
	.frog {
		position: fixed;
		top: 0;
		left: 0;
		width: 64px;
		height: 64px;
		cursor: grab;
		z-index: 100;
		touch-action: none;
		user-select: none;
		transition: filter 0.2s ease;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.frog:hover {
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
	}

	.frog.dragging {
		cursor: grabbing;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5));
	}

	.frog svg {
		display: block;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.frog {
			transition: none;
		}
	}
</style>
