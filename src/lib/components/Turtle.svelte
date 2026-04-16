<script lang="ts">
	import { onMount } from 'svelte';

	let turtleEl: HTMLDivElement;
	let x = $state(0);
	let y = $state(0);
	let dragging = $state(false);
	let blinking = $state(false);
	let pupilX = $state(0);
	let pupilY = $state(0);
	let facing = $state(1);

	let offsetX = 0;
	let offsetY = 0;
	let lastX = 0;

	const STORAGE_KEY = 'turtle-position';
	const SIZE = 72;

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
			if (Math.random() < 0.5) blink();
		}, 4000);

		const lookInterval = setInterval(() => {
			if (!dragging && Math.random() < 0.6) {
				const angle = Math.random() * Math.PI * 2;
				const dist = 1.5 + Math.random() * 1;
				pupilX = Math.cos(angle) * dist;
				pupilY = Math.sin(angle) * dist;
				setTimeout(() => {
					pupilX = 0;
					pupilY = 0;
				}, 900 + Math.random() * 1200);
			}
		}, 4500);

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
		x = window.innerWidth - SIZE - 32;
		y = window.innerHeight - SIZE - 32;
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
		}, 160);
	}

	function savePosition() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		const rect = turtleEl.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
		lastX = e.clientX;
		turtleEl.setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const dx = e.clientX - lastX;
		if (Math.abs(dx) > 2) {
			facing = dx >= 0 ? 1 : -1;
			lastX = e.clientX;
		}
		x = clampX(e.clientX - offsetX);
		y = clampY(e.clientY - offsetY);
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		turtleEl.releasePointerCapture(e.pointerId);
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
	bind:this={turtleEl}
	class="turtle"
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
	aria-label="Draggable turtle companion"
>
	<svg
		viewBox="0 0 72 72"
		width={SIZE}
		height={SIZE}
		aria-hidden="true"
		style="transform: scaleX({facing});"
	>
		<g fill="none" stroke="#a5d6c8" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
			<ellipse cx="14" cy="48" rx="4" ry="2.5" />
			<ellipse cx="58" cy="48" rx="4" ry="2.5" />
			<ellipse cx="22" cy="54" rx="4" ry="2.5" />
			<ellipse cx="50" cy="54" rx="4" ry="2.5" />

			<ellipse cx="54" cy="34" rx="9" ry="7" />

			{#if blinking}
				<line x1="52" y1="31" x2="58" y2="31" stroke-width="1.4" />
			{:else}
				<circle cx={55 + pupilX} cy={31 + pupilY} r="1.4" fill="#a5d6c8" />
			{/if}

			<ellipse cx="36" cy="42" rx="22" ry="17" />

			<path d="M 36 25 L 43 29 L 43 36 L 36 40 L 29 36 L 29 29 Z" />

			<path d="M 16 38 L 22 34 L 28 36 L 27 42 L 21 44 L 14 42 Z" opacity="0.75" />

			<path d="M 44 36 L 50 34 L 57 37 L 58 43 L 51 44 L 45 42 Z" opacity="0.75" />

			<path d="M 20 46 L 27 44 L 33 46 L 32 52 L 24 52 Z" opacity="0.75" />

			<path d="M 39 46 L 45 44 L 52 46 L 48 52 L 40 52 Z" opacity="0.75" />
		</g>

		<g fill="#d4b0c0" opacity="0.8">
			<circle cx="36" cy="32" r="0.9" />
			<circle cx="23" cy="40" r="0.9" />
			<circle cx="50" cy="40" r="0.9" />
		</g>
	</svg>
</div>

<style>
	.turtle {
		position: fixed;
		top: 0;
		left: 0;
		width: 72px;
		height: 72px;
		cursor: grab;
		z-index: 100;
		touch-action: none;
		user-select: none;
		transition: filter 0.2s ease;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
	}

	.turtle:hover {
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.45));
	}

	.turtle.dragging {
		cursor: grabbing;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.55));
	}

	.turtle svg {
		display: block;
		pointer-events: none;
		transition: transform 0.2s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.turtle,
		.turtle svg {
			transition: none;
		}
	}
</style>
