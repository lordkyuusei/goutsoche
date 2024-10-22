import type { Modal } from "$lib/types/modal";
import { writable, type Writable } from "svelte/store";

const modalInfo: Writable<Modal> = writable({
    title: 'Dialog',
    description: 'Default description',
    cancelText: 'Non',
    confirmText: 'Oui',
    cancelCallback: () => {},
    confirmCallback: () => {},
    isOpen: false,
});

export default modalInfo;