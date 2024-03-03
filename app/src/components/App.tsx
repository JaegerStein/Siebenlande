import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../styles/App.scss';

import Left from './Left/Left';
import Center from './Center/Center';
import Right from './Right/Right';

import Markdown from 'react-markdown';
import { loadJSON } from '../scripts/utils';

type SetIndex = Dispatch<SetStateAction<any>>;
type SetOpenEntries = Dispatch<SetStateAction<string[]>>;

const setSiteTitle = (title: string) => { document.title = title; }

const App: FC = () => {
  const [index, setIndex]: [any, SetIndex] = useState({});
  const [openEntries, setOpenEntries]: [string[], SetOpenEntries] = useState([""]); // [entry, subentry, ...

  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => { if (index.vault) setSiteTitle(index.vault); }, [index]);

  // openEntries
  const openEntry = (entry: string) => {
    //setOpenEntries([...openEntries, entry]);
    console.log("Link click arrived in app:", entry);
  }

  return (
    <>
      <div className='left'>
        <Left index={index} openEntry={openEntry} />
      </div>
      <div className='center'>
        <Center />
      </div>
      <div className='right'>
        <Right />
      </div>
    </>
  );
}

export default App;
