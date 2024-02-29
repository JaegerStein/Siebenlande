import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../styles/App.scss';

import Left from './Left';
import Center from './Center';
import Right from './Right';

import Markdown from 'react-markdown';
import { loadJSON } from '../scripts/utils';

type SetIndex = Dispatch<SetStateAction<any>>;

const setSiteTitle = (title: string) => { document.title = title; }

const App: FC = () => {
  const [index, setIndex]: [any, SetIndex] = useState({});

  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => { if (index.vault) setSiteTitle(index.vault); }, [index]);

  return (
    <>
      <div className='left'>
        <Left index={index} />
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
