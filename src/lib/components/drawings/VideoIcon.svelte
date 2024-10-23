<script lang="ts">
    export let size = 1;
    export let animate: boolean = false;
</script>

<div class="icon-video" style:--size="{size}rem">
    <div class="video-claquette" class:clap={animate}>
        <span class="claquette-line"></span>
        <span class="claquette-line"></span>
        <span class="claquette-line"></span>
        <span class="claquette-line"></span>
    </div>
    <div class="video-ardoise">
        <div class="ardoise-head">
            <span class="head-line"></span>
            <span class="head-line"></span>
            <span class="head-line"></span>
            <span class="head-line"></span>
        </div>
        <div class="ardoise-body">
            <span class="body-player"></span>
        </div>
    </div>
</div>

<style>
    .icon-video {
        --border-size: calc(var(--size) / 15);
        --border-color: var(--bg-100);

        display: grid;
        grid-template-rows: 1fr 2.8fr;
        aspect-ratio: 1 / 1;
        height: var(--size);

        & .head-line,
        & .claquette-line {
            width: var(--border-size);
            background-color: var(--border-color);
        }

        & .claquette-line {
            transform: skewX(-30deg);
        }

        & .head-line {
            transform: skewX(30deg);
        }

        & > .video-claquette, & > .video-ardoise {
            background-color: var(--fg-color);
            border: var(--border-size) solid var(--border-color);
        }

        & > .video-claquette {
            display: flex;
            justify-content: space-evenly;
            border-radius: var(--normal-gap) var(--normal-gap) 0 0;

            transform: rotateZ(-10deg);
            transform-origin: bottom left;
            transition: transform 0.25s cubic-bezier(0.075, 0.82, 0.165, 1) ;
            
            &.clap {
                transform: translateY(calc(var(--border-size)));
            }
        }

        & > .video-ardoise {
            display: grid;
            grid-template-rows: repeat(3, 1fr);
            border-radius: 0 0 var(--normal-gap) var(--normal-gap);

            & > .ardoise-head {
                display: flex;
                justify-content: space-evenly;
                border-bottom: var(--border-size) solid var(--border-color);
            }

            & > .ardoise-body {
                display: grid;
                place-items: center;
                grid-row: 2 / 4;

                & > .body-player {
                    border-left: calc(var(--size) / 6) solid var(--border-color);

                    border-top: calc(var(--size) / 8) solid transparent;
                    border-bottom: calc(var(--size) / 8) solid transparent;
                    border-right: calc(var(--size) / 8) solid transparent;
                    transform: translateX(25%);
                }
            }
        }
    }
</style>
