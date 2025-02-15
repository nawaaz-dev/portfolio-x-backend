export declare const querySelector: <T extends HTMLElement = HTMLElement>(selector: string, element?: HTMLElement) => T | null;
export declare const queryByClass: <T extends HTMLElement = HTMLElement>(classPartial: string, element?: HTMLElement) => T | null;
export declare const queryAllByClass: <T extends HTMLElement = HTMLElement>(classPartial: string, element?: HTMLElement) => T[];
declare const jocument: {
    querySelector: <T extends HTMLElement = HTMLElement>(selector: string, element?: HTMLElement) => T | null;
    queryByClass: <T extends HTMLElement = HTMLElement>(classPartial: string, element?: HTMLElement) => T | null;
    queryAllByClass: <T extends HTMLElement = HTMLElement>(classPartial: string, element?: HTMLElement) => T[];
};
export default jocument;
