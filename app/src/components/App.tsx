import React, { ComponentType, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../styles/App.scss';
import '../styles/common/common.scss';

import Left from './Left/Left';
import Center from './Center/Center';
import Right from './Right/Right';
import Entry from './Center/Entry';

import { loadJSON, loadText } from '../scripts/utils';
import { IndexNode } from '../scripts/IndexNode';

type SetIndex = Dispatch<SetStateAction<any>>;
type SetOpenEntries = Dispatch<SetStateAction<ReactNode[]>>;

type Index = IndexNode[];

const setSiteTitle = (title: string) => { document.title = title; }

const App: FC = () => {
  const [index, setIndex]: [any, SetIndex] = useState({});
  const [openEntries, setOpenEntries]: [ReactNode[], SetOpenEntries] = useState<ReactNode[]>([]);

  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => { if (index.vault) setSiteTitle(index.vault); }, [index]);

  const openEntry = (entry: string) => {
    loadText("/Siebenlande/" + entry).then(data => {
      setOpenEntries(openEntries => [...openEntries, <Entry title={entry} content={data} />]);
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
