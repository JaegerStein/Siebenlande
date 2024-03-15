import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import '../styles/App.scss';
import '../styles/common/common.scss';

import Left from './Left/Left';
import Center from './Center/Center';
import Right from './Right/Right';
import Entry from './Center/Entry';

import { loadJSON, loadText } from '../scripts/utils';
import { Index, IndexEntry } from '../scripts/types';


type SetIndex = Dispatch<SetStateAction<any>>;
type SetOpenEntries = Dispatch<SetStateAction<ReactNode[]>>;

const setSiteTitle = (title: string) => { document.title = title; }

const App: FC = () => {
  const [index, setIndex]: [Index, SetIndex] = useState<Index>({} as Index);
  const [openEntries, setOpenEntries]: [ReactNode[], SetOpenEntries] = useState<ReactNode[]>([]);
  const openEntryList: string[] = [];

  const [entryRendered, SetEntryRendered] = useState<boolean>(false);
  const onEntryRendered = () => SetEntryRendered(true);
  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => { if (index.vault) setSiteTitle(index.vault); }, [index]);

  const openEntry = (entry: string) => {
    if (openEntryList.includes(entry)) return;

    const keyPath: string[] = entry.split('/');
    const indexEntry = keyPath.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, index.index as any);
    console.log(indexEntry as IndexEntry);

    setOpenEntries(openEntries => [...openEntries, <Entry entry={indexEntry} path={entry} onRendered={onEntryRendered} onEntryAction={onEntryAction}/>]);
    openEntryList.push(entry);
  }

  const closeEntry = (entry: string) => {
    const index = openEntryList.indexOf(entry);
    if (index === -1) return;

    openEntryList.splice(index, 1);
    setOpenEntries(openEntries => {
      const newOpenEntries = [...openEntries];
      newOpenEntries.splice(index, 1);
      return newOpenEntries;
    });
  }

  const onEntryAction = (entry: string, action: string) => {
    if (action === 'close') closeEntry(entry);
    else if (action === 'open') openEntry(entry);
  }

  return (
    <>
      <div className='left'>
        <Left index={index} openEntry={openEntry} />
      </div>
      <div className='center'>
        <Center>
          {openEntries || <></ >}
        </Center>
      </div>
      <div className='right'>
        <Right openEntries={openEntries} entryRendered={entryRendered} />
      </div>
    </>
  );
}

export default App;
