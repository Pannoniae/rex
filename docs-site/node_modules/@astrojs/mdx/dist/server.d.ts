import type { NamedSSRLoadedRendererValue } from 'astro';
export declare const slotName: (str: string) => string;
export declare function check(Component: any, props: any, { default: children, ...slotted }?: {
    default?: null | undefined;
}): Promise<any>;
export declare function renderToStaticMarkup(this: any, Component: any, props?: {}, { default: children, ...slotted }?: {
    default?: null | undefined;
}): Promise<{
    html: string;
}>;
declare const renderer: NamedSSRLoadedRendererValue;
export default renderer;
