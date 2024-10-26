<script lang="ts">
    import { browser } from '$app/environment';
    import type { Line } from '$lib/types/character';
    import { createEventDispatcher, type EventDispatcher } from 'svelte';

    export let line: Line;

    let dispatcher: EventDispatcher<Record<string, any>> = createEventDispatcher();

    const deleteCharacterLine = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        dispatcher('delete', line.name);
    };
</script>

<div class="character-line">
    <input type="time" step="0.01" bind:value="{line.start}" on:input="{() => dispatcher('update', line)}"/>
    <input type="text" placeholder="Ligne de texte" bind:value="{line.speech}" on:input="{() => dispatcher('update', line)}" />
    <input type="time" step="0.01" bind:value="{line.end}" on:input="{() => dispatcher('update', line)}" />
    <button on:click="{deleteCharacterLine}">🚮</button>
</div>

<style>
    .character-line {
        display: grid;
        grid-template: 100% / auto 1fr auto min-content;
        gap: var(--small-gap);
    }

    button {
        background-color: var(--bg-300);
    }
</style>
