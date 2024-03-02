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
    href: string;
    className?: string;
    linkText?: ReactNode;
    linkType?: LinkType;
    onClick?: () => void;
    onMiddleClick?: () => void;
}

const Link: FC<LinkProps> = ({ href, className, linkText, linkType, onClick, onMiddleClick }: LinkProps) => {

    const handleMouseClick = (event: MouseEvent) => {
        event.preventDefault();
        if (event.button === 1 && onMiddleClick) onMiddleClick();
        else if (onClick) onClick();
    }

    return (
        <a href={href} className={className} onClick={handleMouseClick}>
            {linkText || href}
        </a>
    );
};

export default Link;