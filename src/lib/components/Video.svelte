<script lang="ts">
    import type { Character } from '$lib/types/character';
    import { createEventDispatcher } from 'svelte';
    import VideoPlayer from './VideoPlayer.svelte';
    import VideoTimeline from './VideoTimeline.svelte';

    export let characters: Character[] = [];
    export let file: File;

    let currentTime: number = 0;
    let currentDuration: number = 0;
    let dispatcher = createEventDispatcher();
</script>

<div id="video">
    <VideoPlayer file={file} bind:currentTime bind:currentDuration on:onVideoLoad={(e) => dispatcher('onVideoLoad', e.detail)}></VideoPlayer>
    <VideoTimeline bind:characters bind:currentTime bind:currentDuration></VideoTimeline>
</div>

<style>
    div#video {
        display: grid;
        grid-template: auto 1fr / 100%;
        overflow: hidden;
    }
</style>
