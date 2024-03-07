import React, { FC } from 'react';
import Markdown from 'react-markdown';

interface EntryProps {
    title: string;
    content: string;
}

const Entry: FC<EntryProps> = ({ title, content }: EntryProps) => {


    return (
        <div className='entry'>
            <h1>{title}</h1>
            <hr></hr>
            <div className='entry-body'>
                <Markdown>{content}</Markdown>
            </div>
        </div>
    );
}

export default Entry;