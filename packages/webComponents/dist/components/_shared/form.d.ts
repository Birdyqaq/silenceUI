import { ReactiveController, ReactiveControllerHost } from 'lit';

export type FormValue = File | FormData | string | null;
type FormControlHost = HTMLElement & ReactiveControllerHost;
/**
 * Keeps a form-associated custom element's submitted value in sync.
 * Browsers without ElementInternals still retain the component's UI behavior.
 */
export declare class FormValueController implements ReactiveController {
    private readonly host;
    private readonly getValue;
    private readonly internals;
    constructor(host: FormControlHost, getValue: () => FormValue);
    hostUpdated(): void;
    sync(): void;
    get form(): HTMLFormElement | null;
}
export {};
