import React, { ComponentType, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../styles/App.scss';
import '../styles/common/common.scss';

import Left from './Left/Left';
import Center from './Center/Center';
import Right from './Right/Right';
import Entry from './Center/Entry';

import { loadJSON, loadText } from '../scripts/utils';
import { Index } from '../scripts/types';


type SetIndex = Dispatch<SetStateAction<any>>;
type SetOpenEntries = Dispatch<SetStateAction<ReactNode[]>>;

const setSiteTitle = (title: string) => { document.title = title; }

const App: FC = () => {
  const [index, setIndex]: [Index, SetIndex] = useState<Index>({} as Index);
  const [openEntries, setOpenEntries]: [ReactNode[], SetOpenEntries] = useState<ReactNode[]>([]);

  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => { if (index.vault) setSiteTitle(index.vault); }, [index]);

  const openEntry = (entry: string) => {
    loadText("/Siebenlande/" + entry).then(data => {
      setOpenEntries(openEntries => [...openEntries, <Entry entry={entry} content={data} />]);
    });
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
        <Right openEntries={openEntries}/>
      </div>
    </>
  );
}

export default App;
