<script lang="ts">
    import type { Modal } from "$lib/types/modal";

    export let modalInfo: Modal;

    function confirmModal(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        modalInfo.confirmCallback();
    }

    function cancelModal(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        modalInfo.cancelCallback();
    }
</script>

<dialog title="{modalInfo.title}" open={modalInfo.isOpen}>
    <h1>{modalInfo.title}</h1>
    <p>{modalInfo.description}</p>
    <form method="dialog">
        <button type="submit" class="cancel" on:click={cancelModal}>{modalInfo.cancelText}</button>
        <button type="submit" class="confirm" on:click={confirmModal}>{modalInfo.confirmText}</button>
    </form>
</dialog>

<style>
    dialog {
        position: absolute;
        top: 30%;
        z-index: 2;

        & > form {
            display: grid;
            grid-auto-flow: column;
            gap: var(--normal-gap);
        }
    }
</style>