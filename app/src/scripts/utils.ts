const el = (id: string): HTMLElement | null => document.getElementById(id);
const sel = (query: string): HTMLElement | null => document.querySelector(query);
const selAll = (query: string): NodeListOf<HTMLElement> => document.querySelectorAll(query);
export { el, sel, selAll }

async function load(url: string): Promise<Response> {
    const response: Response = await fetch(url);
    if (!response.ok || response.headers.get('Content-Type')?.includes('text/html')) throw new Error(`Failed to load ${url}`);
    return response;
}
const loadJSON = async (url: string): Promise<any> => await (await load(url)).json();
const loadText = async (url: string): Promise<string> => {
    try { return await (await load(url)).text(); }
    catch (error) { return "Der Eintrag konnte nicht geladen werden."; }
};
export { loadJSON, loadText }

const setTitle = (title: string): void => { document.title = title; };
export { setTitle }