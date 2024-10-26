<script lang="ts">
    import { browser } from '$app/environment';
    import CharacterList from '$lib/components/CharacterList.svelte';
    import Modal from '$lib/components/utils/Modal.svelte';
    import Video from '$lib/components/Video.svelte';
    import { loadFileFromJSON, saveFileAsJSON } from '$lib/functions/file';
    import modalInfo from '$lib/store/modal';
    import type { Character } from '$lib/types/character';

    let file: File;
    let characters: Character[] = [];
    let isSaving: boolean = false;

    const onCharactersUpdated = (e: CustomEvent<Character[]>): void => {
        characters = e.detail;
    };

    const saveProject = async (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        if (browser) {
            isSaving = true;
            const date = Intl.DateTimeFormat('fr-FR').format(new Date());

            const downloadName = `${file.name}_bande-rythmo_${date}.json`;
            const downloadSource = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify({
                    file: await saveFileAsJSON(file),
                    characters,
                }),
            )}`;

            const link = document.createElement('a');
            (link.href = downloadSource), (link.download = downloadName), link.click();

            new Promise((res) => setTimeout(() => res((isSaving = false)), 1000));
        }
    };

    const loadProject = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
        if (browser) {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.maxLength = 1;

            inputFile.addEventListener('change', async (e) => {
                if (inputFile.files) {
                    const sourceFile = inputFile.files[0];
                    const sourceAsText = await sourceFile.text();
                    const jsonFile = JSON.parse(sourceAsText);
                    const convertedFile = loadFileFromJSON(jsonFile.file);

                    if (!convertedFile) return;

                    characters = jsonFile.characters;
                    file = convertedFile;
                    console.log(file);
                }
            })

            inputFile.click();
        }
    };

    const exportProject = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {};
</script>

<header>
    <h1>Goustoche</h1>
    <button class:saving="{isSaving}" on:click="{async (e) => await saveProject(e)}">Sauvegarder le projet</button>
    <button on:click="{loadProject}">Charger un projet</button>
    <button on:click="{loadProject}">Exporter le projet</button>
</header>
<section class:opaque="{$modalInfo.isOpen === true}">
    <div id="render">
        <Video {file} {characters} on:onVideoLoad="{(e) => (file = e.detail)}"></Video>
    </div>
    <hr />
    <div id="texts">
        <CharacterList {characters} on:charactersUpdated="{onCharactersUpdated}"></CharacterList>
    </div>
</section>
<Modal modalInfo="{$modalInfo}"></Modal>

<style>
    header {
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        align-items: center;
        gap: var(--small-gap);
        padding-inline: var(--large-gap);
        background-color: var(--bg-100);

        & > button.saving::after {
            content: '';
            height: 100%;
            aspect-ratio: 1;

            border-radius: var(--small-gap);
            border: 2px solid transparent;
            border-top: 2px solid var(--main-color);
            animation: spin 1s infinite;
        }
    }

    section {
        position: relative;

        display: grid;
        grid-template-columns: 1fr 1px 1fr;
        place-items: center;
        background-color: var(--bg-200);
        padding-block: var(--tiny-gap);
        height: 100%;
        overflow: auto;

        &.opaque {
            filter: brightness(0.5);
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
