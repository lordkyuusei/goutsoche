<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import FileInput from './utils/FileInput.svelte';

    export let currentTime: number = 0;
    export let currentDuration: number = 0;
    export let file: File;
    
    let chosenFile: File | null = null
    let mediaSource: MediaSource;
    let sourceBuffer: SourceBuffer;
    
    let videoSource: HTMLVideoElement;
    let videoIsPlaying: boolean = false;
    
    let dispatcher = createEventDispatcher();

    $: if (file && !chosenFile) {
        console.log(file);
        loadVideo(file);
    }

    const loadVideo = async (loadedFile: File) => {
        chosenFile = loadedFile;
        dispatcher('onVideoLoad', chosenFile);

        const url = URL.createObjectURL(mediaSource);
        videoSource.src = url;
    };

    const putVideoInBuffer = async () => {
        if (chosenFile && mediaSource.readyState === 'open' && sourceBuffer?.updating === false) {
            const source = await chosenFile.arrayBuffer();
            sourceBuffer.appendBuffer(source);
        }
    };

    const togglePlayPause = () => {
        if (videoIsPlaying) {
            videoSource.pause();
        } else {
            videoSource.play();
        }

        videoIsPlaying = !videoIsPlaying;
    };

    const oneFrameForward = () => {
        currentTime += (1 / 60) * 1;
    };

    const oneFrameBackward = () => {
        currentTime -= (1 / 60) * 1;
    };

    const changeVideoTimecode = (ev: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        const { valueAsNumber } = ev.currentTarget;
        currentTime = valueAsNumber;
    };

    onMount(() => {
        mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', async () => {
            sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001f, mp4a.40.2"');

            await putVideoInBuffer();

            sourceBuffer.addEventListener(
                'updateend',
                () => {
                    if (mediaSource.duration === Infinity && sourceBuffer.buffered.length > 0) {
                        const newDuration = sourceBuffer.buffered.end(0);
                        sourceBuffer.remove(newDuration, mediaSource.duration);
                        sourceBuffer.addEventListener(
                            'updateend',
                            () => {
                                mediaSource.duration = newDuration;
                            },
                            { once: true },
                        );
                    }
                },
                { once: true },
            );
        });
    });
</script>

{#if !chosenFile}
    <header>
        <FileInput on:videoLoad="{(e) => loadVideo(e.detail.file)}"></FileInput>
    </header>
{/if}

<div id="video-player" class:hidden="{!chosenFile}">
    <video id="video-source" bind:this="{videoSource}" bind:currentTime bind:duration="{currentDuration}">
        <track kind="captions" /></video
    >
    <ul id="video-controls">
        <li id="video-playpause">
            <button class="video-control" on:click="{togglePlayPause}">{!videoIsPlaying ? '▶️' : '⏸️'}</button>
        </li>
        <li id="video-backward">
            <button class="video-control" on:click="{oneFrameBackward}">⏪</button>
        </li>
        <li id="video-forward">
            <button class="video-control" on:click="{oneFrameForward}">⏩</button>
        </li>
        <li id="video-time">
            <input
                type="range"
                min="0"
                value="{currentTime}"
                max="{currentDuration}"
                step="0.01"
                on:input="{changeVideoTimecode}"
            />
        </li>
        <li id="video-timestate">
            <span>{currentTime.toFixed(1)} / {currentDuration?.toFixed(1)}</span>
        </li>
    </ul>
</div>

<style>
    header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--small-gap);
    }

    
    div#video-player {
        display: grid;
        grid-template: 100% / 100%;
        align-items: end;
        
        &.hidden {
            display: none;
        }
        & > video#video-source,
        & > ul#video-controls {
            grid-area: 1 / 1;
            width: 100%;
        }

        & > ul#video-controls {
            display: grid;
            grid-template:
                'time time time time' auto
                'play backw forw timestate' 4fr / auto auto auto 1fr;

            gap: var(--small-gap);
            padding: 0 var(--small-gap) var(--small-gap) var(--small-gap);

            z-index: 2;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);

            background: linear-gradient(to top, rgba(0 0 0 / 0.9) 25%, transparent 100%);

            & > li#video-playpause {
                grid-area: play;
            }

            & > li#video-backward {
                grid-area: backw;
            }

            & > li#video-forward {
                grid-area: forw;
            }

            & > li#video-timestate {
                grid-area: timestate;
            }

            & > li#video-time {
                grid-area: time;

                & > input {
                    width: 100%;
                }
            }
        }

        &:hover ul#video-controls {
            opacity: 1;
            pointer-events: all;
            transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
    }
</style>
