import React, { FC } from 'react';
import Markdown from 'react-markdown';
import { IndexEntry } from '../../scripts/types';

import { ReactComponent as X } from '../../assets/x.svg';

interface EntryProps {
    entry: IndexEntry | string;
    content: string;
}

const Entry: FC<EntryProps> = ({ entry, content }: EntryProps) => {
    const title = typeof entry === 'string' ? entry : entry.title;

    return (
        <div className='entry'>
            <div className='entry-header'>
                <div className='entry-title'>
                    <h1>{title}</h1>
                    <button><X className='entry-x' /></button>
                </div>
                <div className='entry-meta'>
                </div>
            </div>
            <hr></hr>
            <div className='entry-body'>
                <Markdown>{content}</Markdown>
            </div>
        </div>
    );
}

export default Entry;