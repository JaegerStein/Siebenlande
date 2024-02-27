const el = (id: string): HTMLElement | null => document.getElementById(id);
const sel = (query: string): HTMLElement | null => document.querySelector(query);
const selAll = (query: string): NodeListOf<HTMLElement> => document.querySelectorAll(query);
export {el, sel, selAll}