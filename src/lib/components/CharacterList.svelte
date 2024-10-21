<script lang="ts">
    import { createEventDispatcher, type EventDispatcher } from "svelte";

    import CharacterLine from "$lib/components/CharacterLine.svelte";
    import computeContrastRatio from "$lib/functions/computeConstrastRatio";
    import {
        createNewCharacter,
        createNewLine,
        type Character,
        type Line,
    } from "$lib/types/character";

    let dispatcher: EventDispatcher<Record<string, any>> =
        createEventDispatcher();

    let characters: Character[] = [];
    let selectedCharacter: number | null = null;

    $: currentCharacter = characters[selectedCharacter ?? -1];
    $: dispatcher("charactersUpdated", characters);

    const addNewLine = (name: string) => {
        const characterIndex = characters.findIndex((c) => c.name === name);
        if (characterIndex === -1) return;

        const characterRef = characters[characterIndex];

        characters = characters.with(characterIndex, {
            ...characterRef,
            lines: [...characterRef.lines, createNewLine()],
        });
    };

    const addNewCharacter = () => {
        characters = [...characters, createNewCharacter()];
        selectedCharacter = characters.length - 1;
    };

    const setCharacter = (name: string) =>
        (selectedCharacter =
            characters.findIndex((x) => x.name === name) ?? null);

    const updateLine = (e: CustomEvent<Line>): void => {
        const lineIndex = currentCharacter.lines.findIndex(
            (l) => l.name === e.detail.name,
        );

        currentCharacter.lines = currentCharacter.lines.with(
            lineIndex,
            e.detail,
        );

        const characterIndex = characters.findIndex(c => c.name === currentCharacter.name);
        characters = characters.with(characterIndex, currentCharacter);
    };

    const removeLine = (e: CustomEvent<string>): void => {
        currentCharacter.lines = currentCharacter.lines.filter(
            (l) => l.name !== e.detail,
        );

        const characterIndex = characters.findIndex(c => c.name === currentCharacter.name);
        characters = characters.with(characterIndex, currentCharacter);
    };
</script>

<button on:click={addNewCharacter}>Ajouter un personnage</button>
<ul id="character-list">
    {#each characters as character, i}
        <li class="character-element">
            <button
                on:click={() => setCharacter(character.name)}
                style:color={character.foreground}
                style:background={character.background}>{character.name}</button
            >
        </li>
    {/each}
</ul>

{#if selectedCharacter !== null}
    <details>
        <summary>Informations de {currentCharacter.name}</summary>
        <fieldset id="character-info">
            <label for="character-{currentCharacter.name}"
                >Nom du personnage</label
            >
            <input
                id="character-{currentCharacter.name}"
                type="text"
                bind:value={currentCharacter.name}
            />
            <label
                for="character-foreground-{currentCharacter.name}"
                style:color={currentCharacter.foreground ?? "red"}
                >Couleur du texte</label
            >
            <input type="color" bind:value={currentCharacter.foreground} />
            <label
                for="character-background-{currentCharacter.name}"
                style:color={currentCharacter.background ?? "red"}
                >Couleur du fond</label
            >
            <input type="color" bind:value={currentCharacter.background} />
            contrast checker: {computeContrastRatio(
                currentCharacter.foreground,
                currentCharacter.background,
            )}
        </fieldset>
    </details>

    <button on:click={() => addNewLine(currentCharacter.name)}
        >Ajouter une ligne</button
    >
    <div id="character-lines">
        {#each currentCharacter.lines as line (line.name)}
            <CharacterLine
                lineName={line.name}
                on:update={updateLine}
                on:delete={removeLine}
            ></CharacterLine>
        {/each}
    </div>
{/if}

<style>
    ul#character-list {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: min-content;
        align-items: start;

        margin: 0;
        padding: 0;

        & > li.character-element {
            list-style: none;

            & > button {
                border-radius: 0.25rem 0.25rem 0 0;
            }
        }
    }

    fieldset#character-info {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: var(--normal-gap);
    }

    div#character-lines {
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 2rem;
        gap: 1rem;

        height: 100%;
        overflow: auto;
    }
</style>
