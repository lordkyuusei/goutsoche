<script lang="ts">
    import { createEventDispatcher, type EventDispatcher } from 'svelte';

    import CharacterLine from '$lib/components/CharacterLine.svelte';
    import { type Character, type Line } from '$lib/types/character';
    import { createNewCharacter, createNewLine } from '$lib/functions/generateCharacter&Line';
    import isModalOpen from '$lib/store/modal';
    import modalInfo from '$lib/store/modal';

    let dispatcher: EventDispatcher<Record<string, any>> = createEventDispatcher();

    let characters: Character[] = [];
    let selectedCharacter: number | null = null;

    $: currentChar = characters[selectedCharacter ?? -1];
    $: dispatcher('charactersUpdated', characters);

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

    const removeCharacter = () => {
        $modalInfo = {
            ...$modalInfo,
            title: 'Supprimer ' + currentChar.name,
            description: 'Supprimer ' + currentChar.name + ' de la liste des personnages ?',
            isOpen: true,
            cancelText: 'Non',
            confirmText: 'Oui',
            confirmCallback: () => {
                characters = characters.filter((c) => c.name !== currentChar.name);
                selectedCharacter = null;
                $modalInfo.isOpen = false;
            },
            cancelCallback: () => {
                $modalInfo.isOpen = false;
            }
        }
    };

    const setCharacter = (name: string) => (selectedCharacter = characters.findIndex((x) => x.name === name) ?? null);

    const updateLine = (e: CustomEvent<Line>): void => {
        const lineIndex = currentChar.lines.findIndex((l) => l.name === e.detail.name);

        currentChar.lines = currentChar.lines.with(lineIndex, e.detail);

        const characterIndex = characters.findIndex((c) => c.name === currentChar.name);
        characters = characters.with(characterIndex, currentChar);
    };

    const removeLine = (e: CustomEvent<string>): void => {
        currentChar.lines = currentChar.lines.filter((l) => l.name !== e.detail);

        const characterIndex = characters.findIndex((c) => c.name === currentChar.name);
        characters = characters.with(characterIndex, currentChar);
    };
</script>

<header>
    <h1>Ecriture</h1>
    <button on:click="{addNewCharacter}">Ajouter un personnage</button>
</header>

<ul id="character-list">
    {#each characters as character, i}
        <li class="character-element">
            <button
                on:click="{() => setCharacter(character.name)}"
                style:color="{character.foreground}"
                style:background="{character.background}">{character.name}</button
            >
        </li>
    {/each}
</ul>

{#if selectedCharacter !== null}
    <div id="character-info">
        <input title="Nom du personnage" type="text" id="character-{currentChar.name}" bind:value="{currentChar.name}" />
        <input title="Couleur du texte" type="color" bind:value="{currentChar.foreground}" />
        <input title="Couleur du fond" type="color" bind:value="{currentChar.background}" />
        <button title="Supprimer" type="button" on:click={removeCharacter}>X</button>
    </div>

    <div id="character-lines">
        {#each currentChar.lines as line (line.name)}
            <CharacterLine lineName="{line.name}" on:update="{updateLine}" on:delete="{removeLine}"></CharacterLine>
        {/each}
    </div>
    <button on:click="{() => addNewLine(currentChar.name)}">Ajouter une ligne</button>
{/if}

<style>
    header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--small-gap);
    }

    ul#character-list {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: min-content;
        overflow-x: auto;      
        align-items: start;

        margin: 0;
        padding: 0;

        & > li.character-element {
            list-style: none;

            & > button {
                border-radius: var(--tiny-gap) var(--tiny-gap) 0 0;
            }
        }
    }

    div#character-info {
        display: grid;
        grid-template: 1fr / 1fr 1fr 1fr min-content;

        gap: var(--small-gap);
        padding: var(--small-gap);
        border-radius: var(--tiny-gap);
        background: var(--bg-high-color);

        & > input {
            height: 100%;
            width: 100%;
        }

        & > button {
            background-color: red;
        }

    }

    div#character-lines {
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: 2rem;
        gap: var(--small-gap);
        padding: var(--small-gap);

        height: 100%;
        overflow-y: auto;
        border-radius: var(--tiny-gap);
        background: var(--bg-high-color);
    }
</style>
