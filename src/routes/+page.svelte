<script lang="ts">
    import CharacterList from "$lib/components/CharacterList.svelte";
    import Modal from "$lib/components/utils/Modal.svelte";
    import Video from "$lib/components/Video.svelte";
    import modalInfo from "$lib/store/modal";
    import type { Character } from "$lib/types/character";

    let characters: Character[] = [];

    const onCharactersUpdated = (e: CustomEvent<Character[]>): void => {
        characters = e.detail;        
    }

    function addNewCharacter(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        throw new Error("Function not implemented.");
    }
</script>

<header>
    <h1>Goustoche</h1>
    <button on:click={addNewCharacter}>Ajouter un personnage</button>
</header>
<section class:opaque={$modalInfo.isOpen === true}>
    <div id="render">
        <Video {characters}></Video>
    </div>
    <hr />
    <div id="texts">
        <CharacterList on:charactersUpdated={onCharactersUpdated}></CharacterList>
    </div>
</section>
<Modal modalInfo={$modalInfo}></Modal>

<style>
    header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        padding-inline: var(--large-gap);
        background-color: var(--bg-100);
    }

    section {
        position: relative;

        display: grid;
        grid-template-columns: 1fr 1px 1fr;
        place-items: center;
        background-color: var(--bg-200);
        padding-block: var(--tiny-gap);

        &.opaque {
            opacity: 0.8;
        }
    }

    #texts,
    #render {
        width: 100%;
        height: 100%;

        display: grid;
        gap: var(--small-gap);
        padding: var(--small-gap);
    }

    #texts {
        grid-area: 1 / 3;
        overflow: auto;
        grid-template-rows: repeat(3, auto) 1fr auto;
    }

    #render {
        grid-area: 1 / 1;
        grid-auto-flow: row;
        grid-auto-rows: min-content;
    }

    hr {
        grid-area: 1 / 2;
        height: 100%;
    }
</style>
