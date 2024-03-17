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

    const entryPath: string = path.split('/').slice(0, -1).join('/') + '/';
    const tags: string[] = entry.tags || [];
    const aliases: string[] = entry.aliases || [];

    function removeFrontmatter(text: string): string {
        const lines = text.split('\n');
        if (lines[0].trim() === '---') {
            let i = 1;
            while (i < lines.length && lines[i].trim() !== '---') i++;
            
            // this means frontmatter was not closed properly, just throw the whole text back
            if (i === lines.length) { return text; }
            
            return lines.slice(i + 1).join('\n');
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
                <span className='entry-path'>{entryPath}</span>
                <button onClick={() => entryAction(path, EntryAction.CLOSE)}><X className='entry-x' /></button>
                <div className='entry-title'>
                    <h1>{entry.title}</h1>
                </div>
                <span className='entry-aliases'>{aliases.join(", ")}</span>
                <div className='entry-meta'>
                    {tags.map((tag, index) => (
                        <span key={index} className='entry-tag'>{tag}</span>
                    ))}
                </div>
                <hr></hr>
            </div>
            <div className='entry-body'>
                <Markdown>{content}</Markdown>
            </div>
        </div>
    );
}

export default Entry;