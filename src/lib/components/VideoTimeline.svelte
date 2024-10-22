<script lang="ts">
    import { VIDEO_COEFFICIENT } from '$lib/consts';
    import type { Character } from '$lib/types/character';

    export let characters: Character[] = [];
    export let currentTime: number = 0;
    export let currentDuration: number = 0;

    $: timelineSpeed = VIDEO_COEFFICIENT * currentTime * -1;
    $: timelineLength = currentDuration * VIDEO_COEFFICIENT;

    const getStartingArea = (start: string) => {
        if (start.trim() === '') return 0;

        const [, , secondsMilliseconds] = start.split(':');

        return parseFloat(secondsMilliseconds) * VIDEO_COEFFICIENT;
    };

    const getSpeechLength = (start: string, end: string) => {
        if (start.trim() === '' || end.trim() === '') return 0;

        const [, , startSecondsMilliseconds] = start.split(':');
        const [, , endSecondsMilliseconds] = end.split(':');

        const minValue = Math.max(
            0,
            (parseFloat(endSecondsMilliseconds) - parseFloat(startSecondsMilliseconds)) * VIDEO_COEFFICIENT,
        );
        return minValue;
    };

    const getTextScaling = (speechLength: number, liElement: HTMLLIElement | null) => {
        if (!liElement) return 1;

        console.log(speechLength, liElement.offsetWidth)
        return speechLength / liElement.offsetWidth;
    };
</script>

<div id="video-timeline" style:width="calc(100% + {timelineLength}px)">
    <ul id="timeline-characters" style:transform="translateX({timelineSpeed}px)">
        {#each characters as character}
            <li class="character-row" style:color="{character.foreground}" style:background="{character.background}">
                <ul id="row-{character.name}-lines">
                    {#each character.lines as line}
                        {@const speechLength = getSpeechLength(line.start, line.end)}
                        {@const textOffset = getStartingArea(line.start)}
                        {@const textScaling = getTextScaling(speechLength, line.htmlElement ?? null)}
                        <li
                            style:transform="translateX(calc(7rem + {textOffset}px)) scaleX({textScaling})"
                            bind:this="{line.htmlElement}"
                        >
                            {line.speech}
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>
</div>

<style>
    div#video-timeline {
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
                    display: grid;
                    grid-template: auto / 100%;

                    & > li {
                        grid-area: 1/1;
                        font-size: xx-large;
                        text-wrap: nowrap;
                        transform-origin: left;
                        width: fit-content;
                    }
                }
            }
        }
    }
</style>
