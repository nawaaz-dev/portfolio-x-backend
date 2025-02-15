interface IElement<Element extends HTMLElement = HTMLElement> extends HTMLElement {
    queryByClass(classPartial: string): IElement<Element> | null;
}
export declare class TElement<Element extends HTMLElement = HTMLElement> extends HTMLElement implements IElement<Element> {
    element: Element | null;
    constructor();
    private setElement;
    private getElementFromClassPartial;
    queryByClass(classPartial: string): TElement<Element> | null;
}
export {};
