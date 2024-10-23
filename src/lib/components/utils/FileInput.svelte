<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import VideoIcon from '../drawings/VideoIcon.svelte';

    let dispatcher = createEventDispatcher();
    let inputFileDivRef: HTMLDivElement;
    let isDragging: boolean = false;

    let files: FileList;

    const loadVideo = async () => {
        dispatcher('videoLoad', {
            file: files[0],
        })
    };

    const toggleIsDragging = () => isDragging = !isDragging;

</script>

<div class="input-file" bind:this="{inputFileDivRef}">
    <VideoIcon size={8} animate={isDragging}></VideoIcon>
    <h2>Glissez / déposez une vidéo ou <u>cliquez ici</u></h2>
    <input
        type="file"
        bind:files
        maxlength="1"
        on:change={loadVideo}
        on:dragenter="{() => toggleIsDragging()}"
        on:dragleave="{() => toggleIsDragging()}"
    />
</div>

<style>
    .input-file {
        position: relative;
        width: 100%;

        display: grid;
        grid-template-rows: 1.5fr 1fr;
        place-items: center;
        padding-block: var(--large-gap);
        border-radius: var(--large-gap);
        border: var(--tiny-gap) dashed var(--bg-400);

        & > input {
            position: absolute;
            width: 100%;
            height: 100%;

            top: 0;
            left: 0;
            opacity: 0;
        }
    }

</style>
