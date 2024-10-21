<script lang="ts">
    import type { Character } from '$lib/types/character';
    import { onMount } from 'svelte';

    const VIDEO_COEFFICIENT = 180;

    export let characters: Character[] = [];

    let files: FileList;
    let videoSource: HTMLVideoElement;
    let chosenFile: File | null = null;

    let mediaSource: MediaSource;
    let sourceBuffer: SourceBuffer;

    let videoIsPlaying: boolean = false;
    let videoCurrentTime: number = 0;
    let videoDuration: number;

    $: timelineSpeed = VIDEO_COEFFICIENT * videoCurrentTime * -1;
    $: timelineLength = videoDuration * VIDEO_COEFFICIENT;

    const loadVideo = async (ev: ChangeEventHandler<HTMLInputElement>) => {
        chosenFile = files[0];

        const url = URL.createObjectURL(mediaSource);
        videoSource.src = url;
    };

    const putVideoInBuffer = async () => {
        if (chosenFile && mediaSource.readyState === 'open' && sourceBuffer?.updating === false) {
            const source = await chosenFile.arrayBuffer();
            sourceBuffer.appendBuffer(source);
        }
    };

    onMount(() => {
        mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', async (event) => {
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

    const togglePlayPause = (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        if (videoIsPlaying) {
            videoSource.pause();
        } else {
            videoSource.play();
        }

        videoIsPlaying = !videoIsPlaying;
    };

    const oneFrameForward = (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        videoCurrentTime += (1 / 60) * 1;
    };

    const oneFrameBackward = (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        videoCurrentTime -= (1 / 60) * 1;
    };

    const changeVideoTimecode = (ev: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        const { valueAsNumber } = ev.currentTarget;
        videoCurrentTime = valueAsNumber;
    };

    const getStartingArea = (start: string) => {
        if (start.trim() === '') return 0;

        const [, , secondsMilliseconds] = start.split(':');

        return parseFloat(secondsMilliseconds) * VIDEO_COEFFICIENT;
    };

    const getSpeechLength = (start: string, end: string) => {
        if (start.trim() === '' || end.trim() === '') return 0;

        const [, , startSecondsMilliseconds] = start.split(':');
        const [, , endSecondsMilliseconds] = end.split(':');

        const minValue = Math.max(0, (parseFloat(endSecondsMilliseconds) - parseFloat(startSecondsMilliseconds)) * VIDEO_COEFFICIENT);
        return minValue;
    };

    const getTextScaling = (speechLength: number, liElement: HTMLLIElement | null) => {
        if (!liElement) return 1;

        return speechLength / liElement.offsetWidth;
    }
</script>

{#if !chosenFile}
    <input type="file" bind:files maxlength="1" on:change="{loadVideo}" />
{/if}

<div id="video" class:hidden="{!chosenFile}">
    <div id="video-player">
        <video
            id="video-source"
            bind:this="{videoSource}"
            bind:currentTime="{videoCurrentTime}"
            bind:duration="{videoDuration}"
        >
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
                    value="{videoCurrentTime}"
                    max="{videoDuration}"
                    step="0.01"
                    on:input="{changeVideoTimecode}"
                />
            </li>
            <li id="video-timestate">
                <span>{videoCurrentTime.toFixed(0)} / {videoDuration?.toFixed(0)}</span>
            </li>
        </ul>
    </div>
    <div id="video-timeline" style:width="calc(100% + {timelineLength}px)">
        <ul id="timeline-characters" style:transform="translateX({timelineSpeed}px)">
            {#each characters as character}
                <li
                    class="character-row"
                    style:color="{character.foreground}"
                    style:background="{character.background}"
                >
                    <ul id="row-{character.name}-lines">
                        {#each character.lines as line}
                            {@const speechLength = getSpeechLength(line.start, line.end)}
                            {@const textOffset = getStartingArea(line.start)}
                            {@const textScaling = getTextScaling(speechLength, line.htmlElement ?? null)}
                            <li
                                style:transform="translateX({textOffset}px) scaleX({textScaling})"
                                bind:this={line.htmlElement}
                            >
                                {line.speech}
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    div#video {
        display: grid;
        grid-template: auto 1fr / 100%;
        overflow: hidden;

        &.hidden {
            display: none;
        }

        & > div#video-player {
            display: grid;
            grid-template: 100% / 100%;
            align-items: end;

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

        & > div#video-timeline {
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                height: 100%;

                width: 0.25rem;
                background-color: var(--main-color);
                left: 7rem;
                z-index: 1;
            }

            & > ul#timeline-characters {
                display: grid;
                grid-auto-rows: 1fr;

                & > li.character-row {
                    color: var(--bg-color);
                    background: var(--fg-color);

                    & > ul[id^='row'] {
                        position: relative;
                        display: flex;

                        & > li {
                            border: 1px solid green;
                            text-wrap: nowrap;
                            transform-origin: left;
                        }
                    }
                }
            }
        }
    }
</style>
