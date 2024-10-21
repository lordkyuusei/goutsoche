<script lang="ts">
    import CharacterList from "$lib/components/CharacterList.svelte";
    import Video from "$lib/components/Video.svelte";
    import type { Character } from "$lib/types/character";

    let characters: Character[] = [];

    const onCharactersUpdated = (e: CustomEvent<Character[]>): void => {
        characters = e.detail;        
    }
</script>

<section>
    <div id="texts">
        <h1>Ecriture</h1>
        <CharacterList on:charactersUpdated={onCharactersUpdated}></CharacterList>
    </div>
    <hr />
    <div id="render">
        <h1>Montage</h1>
        <Video {characters}></Video>
    </div>
</section>

<style>
    section {
        display: grid;
        grid-template-columns: 1fr 1px 1fr;
    }

    #texts,
    #render {
        padding: 1rem;
        display: grid;
        gap: 1rem;
    }

    #texts {
        overflow: auto;
        grid-template-rows: repeat(4, min-content) max-content;
    }

    #render {
        grid-auto-flow: row;
        grid-auto-rows: min-content;
    }
</style>
