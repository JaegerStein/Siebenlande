import React, { FC, ReactNode, MouseEvent } from 'react';

// Links can have 1 of 4 types: internal, external, download, or anchor
// Their hrefs look like this:
// internal: "Entry", "Subfolder/Entry"
// external: "https://example.com" or also "https://thissite.com", if the page is not part of the knowledge base
// download: "/file.xlsx", "/file.pdf"
// anchor: "Entry#Heading With Spaces"
enum LinkType {
    INTERNAL = 'internal',
    EXTERNAL = 'external',
    DOWNLOAD = 'download',
    ANCHOR = 'anchor',
}

interface LinkProps {
    to: string;
    className?: string;
    linkType?: LinkType;
    onClick?: (entry: string) => void;
    children?: ReactNode;
}

const Link: FC<LinkProps> = ({ to, className, linkType, onClick, children }: LinkProps) => {

    const handleMouseClick = (event: MouseEvent) => {
        event.preventDefault();
        if (onClick) onClick(to);
    }

    return (
        <a href={to} className={className} onClick={handleMouseClick}>
            {children || to}
        </a>
    );
};

export default Link;