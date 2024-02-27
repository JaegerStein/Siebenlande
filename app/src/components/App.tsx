import React, { FC, useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../styles/App.scss';

import Left from './Left';
import Center from './Center';
import Right from './Right';

import Markdown from 'react-markdown';

const App: FC = () => {
    return (
      <>
        <div className='left'>
          <Left />
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
