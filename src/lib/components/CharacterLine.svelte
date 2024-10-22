<script lang="ts">
    import { createEventDispatcher, type EventDispatcher } from 'svelte';

    export let lineName: string;

    let dispatcher: EventDispatcher<Record<string, any>> = createEventDispatcher();

    let startTimecode: string = '00:00:00.000';
    let speech: string = '';
    let endTimecode: string = '00:00:03.000';

    $: dispatcher('update', { name: lineName, start: startTimecode, speech, end: endTimecode });

    const deleteCharacterLine = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        dispatcher('delete', lineName);
    };
</script>

<div class="character-line">
    <input type="time" step="0.01" bind:value="{startTimecode}" />
    <input type="text" placeholder="Monologue" bind:value="{speech}" />
    <input type="time" step="0.01" bind:value="{endTimecode}" />
    <button on:click="{deleteCharacterLine}">🚮</button>
</div>

<style>
    .character-line {
        display: grid;
        grid-template: 100% / auto 1fr auto min-content;
        gap: var(--small-gap);
    }
</style>
