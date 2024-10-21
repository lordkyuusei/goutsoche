<script lang="ts">
    import { onMount } from "svelte";

    let files: FileList;
    let videoSource: HTMLVideoElement;
    let chosenFile: File | null = null;

    let mediaSource: MediaSource;
    let sourceBuffer: SourceBuffer;

    let videoIsPlaying: boolean = false;
    let videoCurrentTime: number = 0;
    let videoDuration: number;

    $: console.log(videoSource?.duration);
    const loadVideo = async (ev: ChangeEventHandler<HTMLInputElement>) => {
        chosenFile = files[0];

        const url = URL.createObjectURL(mediaSource);
        videoSource.src = url;
    };

    const putVideoInBuffer = async () => {
        if (
            chosenFile &&
            mediaSource.readyState === "open" &&
            sourceBuffer?.updating === false
        ) {
            const source = await chosenFile.arrayBuffer();
            sourceBuffer.appendBuffer(source);
        }
    };

    onMount(() => {
        mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", async (event) => {
            sourceBuffer = mediaSource.addSourceBuffer(
                'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
            );

            await putVideoInBuffer();

            sourceBuffer.addEventListener(
                "updateend",
                () => {
                    if (
                        mediaSource.duration === Infinity &&
                        sourceBuffer.buffered.length > 0
                    ) {
                        const newDuration = sourceBuffer.buffered.end(0);
                        sourceBuffer.remove(newDuration, mediaSource.duration);
                        sourceBuffer.addEventListener(
                            "updateend",
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

    const togglePlayPause = (
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) => {
        if (videoIsPlaying) {
            videoSource.pause();
        } else {
            videoSource.play();
        }

        videoIsPlaying = !videoIsPlaying;
    };

    const oneFrameForward = (
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) => {
        videoCurrentTime += (1 / 60) * 1;
    };

    const oneFrameBackward = (
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) => {
        videoCurrentTime -= (1 / 60) * 1;
    };

    const changeVideoTimecode = (
        ev: Event & { currentTarget: EventTarget & HTMLInputElement },
    ) => {
        const { valueAsNumber } = ev.currentTarget;
        videoCurrentTime = valueAsNumber;
    };
</script>

<input type="file" bind:files maxlength="1" on:change={loadVideo} />

<div id="video-wrapper" class:hidden={!chosenFile}>
    <video
        id="video-source"
        bind:this={videoSource}
        bind:currentTime={videoCurrentTime}
        bind:duration={videoDuration}
    >
        <track kind="captions" /></video
    >
    <ul id="video-controls">
        <li>
            <button
                id="video-playpause"
                class="video-control"
                on:click={togglePlayPause}
                >{!videoIsPlaying ? "▶️" : "⏸️"}</button
            >
        </li>
        <li>
            <button
                id="video-backward"
                class="video-control"
                on:click={oneFrameBackward}>⏪</button
            >
        </li>
        <li>
            <button
                id="video-forward"
                class="video-control"
                on:click={oneFrameForward}>⏩</button
            >
        </li>
        <li>
            <input
                id="video-time"
                type="range"
                min="0"
                value={videoCurrentTime}
                max={videoDuration}
                on:change={changeVideoTimecode}
            />
        </li>
        <li>
            <span id="video-timestate"
                >{videoCurrentTime.toPrecision(3)} / {videoDuration?.toPrecision(
                    3,
                )}</span
            >
        </li>
    </ul>
</div>

<style>
    div#video-wrapper {
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
            grid-auto-flow: column;
            grid-template:
                "time time time time" 1fr
                "play backw forw timestate" 4fr / auto auto auto auto;

            max-height: 10%;
            gap: var(--small-gap);
            padding: 0 var(--small-gap) var(--small-gap) var(--small-gap);

            z-index: 2;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);

            background: linear-gradient(
                to top,
                var(--bg-color) 25%,
                transparent 100%
            );
        }

        &:hover > ul#video-controls {
            opacity: 1;
            pointer-events: all;
            transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
    }
</style>
