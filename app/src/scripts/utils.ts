const el = (id: string): HTMLElement | null => document.getElementById(id);
const sel = (query: string): HTMLElement | null => document.querySelector(query);
const selAll = (query: string): NodeListOf<HTMLElement> => document.querySelectorAll(query);
export { el, sel, selAll }

async function load(url: string): Promise<Response> {
    const response: Response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response;
}
const loadJSON = async (url: string): Promise<any> => await (await load(url)).json();
const loadText = async (url: string): Promise<string> => await (await load(url)).text();
export { loadJSON, loadText }