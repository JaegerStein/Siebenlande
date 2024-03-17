import { useContext, useEffect } from "react";
import { el, make } from "../../scripts/utils";

import '../../styles/Right.scss';
import { EntryContext } from "../App";

const Right = () => {
    const { openEntries, entryRendered } = useContext(EntryContext)

    const makeID = () => Math.random().toString(36).substring(7);

    useEffect(() => {
        if (!entryRendered) return;

        const river = el('river');
        const entries = river?.querySelectorAll('.entry');
        const navContainer = el('navContainer');

        navContainer!.innerHTML = '';

        entries?.forEach((entry) => {
            const entryDiv = make('div');
            entryDiv.className = 'entry-nav-group';
            const headers = entry.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headers.forEach((header) => {

                const id = header.textContent!.replace(' ', '') + '-' + makeID();
                header.id = id;

                const link = make('a') as HTMLAnchorElement;
                link.href = `#${id}`;
                link.textContent = header.textContent;
                link.className = header.className.includes('entry-title') && header.tagName === 'H1' ? 'depth-0' : `depth-${header.tagName.charAt(1)}`;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    el(id)?.scrollIntoView({ behavior: 'smooth' });
                });

                entryDiv.appendChild(link);
            });
            navContainer?.appendChild(entryDiv);
        });
    }, [openEntries, entryRendered]);

    return (
        <div id="navContainer">

        </div>
    );
}

export default Right;