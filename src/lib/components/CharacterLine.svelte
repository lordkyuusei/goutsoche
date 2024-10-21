<script lang="ts">
    import { createEventDispatcher, type EventDispatcher } from "svelte";
    import { type Line } from "$lib/types/character";

    export let lineName: string;

    let dispatcher: EventDispatcher<Record<string, any>> =
        createEventDispatcher();

    let startTimecode: string;
    let speech: string;
    let endTimecode: string;

    const updateCharacterLine = () => {
        dispatcher("update", {
            name: lineName,
            start: startTimecode,
            speech,
            end: endTimecode,
        } as Line);
    };
    const deleteCharacterLine = (
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) => {
        dispatcher("delete", lineName);
    };
</script>

<div class="character-line">
    <input
        type="time"
        step="0.001"
        bind:value={startTimecode}
        on:change={() => updateCharacterLine}
    />
    <input
        type="text"
        placeholder="Monologue"
        bind:value={speech}
        on:change={() => updateCharacterLine}
    />
    <input
        type="time"
        step="0.001"
        bind:value={endTimecode}
        on:change={() => updateCharacterLine}
    />
    <button on:click={deleteCharacterLine}>🚮</button>
</div>

<style>
    .character-line {
        display: grid;
        grid-template: 100% / 0.25fr 1fr 0.25fr auto;
        gap: var(--small-gap);
    }
</style>
