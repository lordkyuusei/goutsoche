export type Modal = {
    title: string,
    description: string,
    cancelText: string,
    confirmText: string,
    cancelCallback: Function,
    confirmCallback: Function,
    isOpen: boolean
}