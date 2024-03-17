import { createContext, Dispatch, FC, Fragment, ReactNode, SetStateAction, useEffect, useState } from 'react';

// Styles
import '../styles/App.scss';
import '../styles/common/common.scss';

// Components
import Center from './Center/Center';
import Entry from './Center/Entry';
import Left from './Left/Left';
import Right from './Right/Right';

// Scripts and types
import { EntryAction, Index, IndexEntry } from '../scripts/types';
import { loadJSON, setTitle } from '../scripts/utils';


// State action shorthand types
type SetIndex = Dispatch<SetStateAction<Index>>;
type OpenEntries = { [key: string]: ReactNode };
type SetOpenEntries = Dispatch<SetStateAction<OpenEntries>>;

// App context
interface IndexContextType { index: Index; }
export const IndexContext = createContext<IndexContextType>({ index: {} as Index });

interface EntryContextType {
  openEntries: OpenEntries;
  entryAction: (entry: string, action: EntryAction) => void;
  renderEntry: (renderFinished: boolean) => void;
  entryRendered: boolean;
}
export const EntryContext = createContext<EntryContextType>({ openEntries: {}, entryAction: () => { }, renderEntry: () => { }, entryRendered: true});

const App: FC = () => {
  const [index, setIndex]: [Index, SetIndex] = useState<Index>({} as Index);
  const [openEntries, setOpenEntries]: [OpenEntries, SetOpenEntries] = useState<OpenEntries>({});
  const [entryRendered, setEntryRendered] = useState<boolean>(true);
  const renderEntry = (renderFinished: boolean) => setEntryRendered(renderFinished);

  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => {
    if (index.vault) setTitle(index.vault);
    if (index.homepage) openEntry(index.homepage);
  }, [index]);

  const openEntry = (entry: string) => {
    if (openEntries[entry] || !entryRendered) return;

    const keyPath: string[] = entry.split('/');
    const indexEntry = keyPath.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, index.index as any);

    renderEntry(false);
    setOpenEntries(openEntries => ({ ...openEntries, [entry]: <Entry entry={indexEntry} path={entry} /> }));
  }

  const closeEntry = (entry: string) => {
    setOpenEntries(openEntries => {
      if (!openEntries[entry]) return openEntries;

      const newOpenEntries = { ...openEntries };
      delete newOpenEntries[entry];
      return newOpenEntries;
    });
  }

  const entryAction = (entry: string, action: string) => {
    if (action === 'close') closeEntry(entry);
    else if (action === 'open') openEntry(entry);
  }

  return (
    <IndexContext.Provider value={{ index }}>
      <EntryContext.Provider value={{ openEntries, entryAction, renderEntry, entryRendered }}>
        <div className='left'>
          <Left />
        </div>
        <div className='center'>
          <Center>
            {Object.entries(openEntries).map(([key, value]) =>
              <Fragment key={key}>
                {value}
              </ Fragment>
            )}
          </Center>
        </div>
        <div className='right'>
          <Right />
        </div>
      </EntryContext.Provider>
    </IndexContext.Provider>
  );
}

export default App;
