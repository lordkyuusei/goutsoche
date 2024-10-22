<script lang="ts">
    import type { Character } from '$lib/types/character';
    import VideoPlayer from './VideoPlayer.svelte';
    import VideoTimeline from './VideoTimeline.svelte';

    export let characters: Character[] = [];

    let currentTime: number = 0;
    let currentDuration: number = 0;
</script>

<div id="video">
    <VideoPlayer bind:currentTime bind:currentDuration></VideoPlayer>
    <VideoTimeline bind:characters bind:currentTime bind:currentDuration></VideoTimeline>
</div>

<style>
    div#video {
        display: grid;
        grid-template: auto 1fr / 100%;
        overflow: hidden;
    }
</style>
