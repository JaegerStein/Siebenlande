import React from 'react';

interface LinkProps {
    href: string;
    target?: string;
    rel?: string;
    className?: string;
    children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, target, rel, className, children }) => {
    return (
        <a href={href} target={target} rel={rel} className={className}>
            {children}
        </a>
    );
};

export default Link;