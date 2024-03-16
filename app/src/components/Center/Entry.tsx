import React, { FC, useContext, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { EntryAction, IndexEntry } from '../../scripts/types';

import { ReactComponent as X } from '../../assets/x.svg';
import { loadText } from '../../scripts/utils';
import { EntryContext } from '../App';

interface EntryProps {
    entry: IndexEntry;
    path: string;
}

const Entry: FC<EntryProps> = ({ entry, path }: EntryProps) => {
    const [content, setContent] = useState<string>('');
    const {entryAction, renderEntry} = useContext(EntryContext);

    function removeFrontmatter(text: string): string {
        const lines = text.split('\n');
        if (lines[0].trim() === '---') {
            let i = 1;
            while (i < lines.length && lines[i].trim() !== '---') i++;
            
            // this means frontmatter was not closed properly, just throw the whole text back
            if (i === lines.length) { return text; }
            
            const [, ...contentLines] = lines.slice(i + 1);
            return contentLines.join('\n');
        }
        return text;
    }

    useEffect(() => {
        loadText("/Siebenlande/" + path).then(data => {
            setContent(removeFrontmatter(data));
            renderEntry(true);
        });
    }, []);

    return (
        <div className='entry'>
            <div className='entry-header'>
                <div className='entry-title'>
                    <h1>{entry.title}</h1>
                    <button onClick={() => entryAction(path, EntryAction.CLOSE)}><X className='entry-x' /></button>
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