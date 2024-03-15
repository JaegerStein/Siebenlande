import React, { FC, ReactNode, useEffect } from "react";
import { el } from "../../scripts/utils";

import '../../styles/Right.scss';

interface RightProps {
    openEntries: ReactNode[];
    entryRendered: boolean;
}

const Right: FC<RightProps> = ({ openEntries, entryRendered }: RightProps) => {
    useEffect(() => {
        if (!entryRendered) return;
        const river = el('river');
        const headers = river?.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const navContainer = document.getElementById('navContainer');

        navContainer!.innerHTML = '';

        headers?.forEach((header) => {
            const id = Math.random().toString(36).substring(7);
            header.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = header.textContent;
            link.className = `depth-${header.tagName.charAt(1)}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            });

            navContainer?.appendChild(link);

            const br = document.createElement('br');
            navContainer?.appendChild(br);
        });
    }, [openEntries, entryRendered]);

    return (
        <div id="navContainer">

        </div>
    );
}

export default Right;