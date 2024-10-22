<script lang="ts">
    import CharacterList from "$lib/components/CharacterList.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Video from "$lib/components/Video.svelte";
    import modalInfo from "$lib/store/modal";
    import type { Character } from "$lib/types/character";
    import { type GridConfiguration } from "$lib/types/grid";

    let characters: Character[] = [];
    let selectedConfiguration: GridConfiguration = 'center-configuration';

    const switchConfiguration = () => {
        selectedConfiguration =
            selectedConfiguration === 'left-configuration' ? 'center-configuration' : 
            selectedConfiguration === 'center-configuration' ? 'right-configuration' : 'left-configuration';
    }

    const onCharactersUpdated = (e: CustomEvent<Character[]>): void => {
        characters = e.detail;        
    }
</script>

<section class={selectedConfiguration} class:opaque={$modalInfo.isOpen === true}>
    <div id="texts">
        <CharacterList on:charactersUpdated={onCharactersUpdated}></CharacterList>
    </div>
    <hr />
    <button class="switch" on:click="{switchConfiguration}">🌀</button>
    <div id="render">
        <Video {characters}></Video>
    </div>
</section>
<Modal modalInfo={$modalInfo}></Modal>

<style>
    section {
        position: relative;
        display: grid;
        place-items: center;
        padding-block: var(--tiny-gap);

        &.opaque {
            opacity: 0.5;
        }

        &.left-configuration {
            grid-template-columns: 2fr 1px 1fr;
        }

        &.center-configuration {
            grid-template-columns: 1fr 1px 1fr;
        }

        &.right-configuration {
            grid-template-columns: 1fr 1px 2fr;
        }
    }

    #texts,
    #render {
        padding: var(--small-gap);
        display: grid;
        gap: var(--small-gap);
        width: 100%;
        height: 100%;
    }

    #texts {
        grid-area: 1 / 1;
        overflow: auto;
        grid-template-rows: repeat(3, auto) 1fr auto;
    }

    #render {
        grid-area: 1 / 3;
        grid-auto-flow: row;
        grid-auto-rows: min-content;
    }

    hr {
        grid-area: 1 / 2;
        height: 100%;
    }

    button.switch {
        grid-area: 1 / 2;
        z-index: 2;

        border-radius: 2rem;
        border: 0;
        background-color: var(--main-color);
        aspect-ratio: 1;
    }
</style>
