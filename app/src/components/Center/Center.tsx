import React, { FC, ReactNode } from 'react';
import Entry from './Entry';
import '../../styles/Center.scss';

interface CenterProps {
    children?: ReactNode;
}

const Center: FC<CenterProps> = ({ children }: CenterProps) => {
    return (
        <div id='river'>
            {children}
        </div>
    );
}

export default Center;