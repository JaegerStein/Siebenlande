import React, { ReactNode, FC } from 'react';
import '../../styles/components/Tag.scss';

interface TagProps {
    dataTag?: string;
    children?: ReactNode;
}

const Tag: FC<TagProps> = ({ dataTag, children }: TagProps) => {
    return <span className='tag' data-tag={dataTag}>{children}</span>
}

export default Tag;