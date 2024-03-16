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
import { Index, IndexEntry } from '../scripts/types';
import { loadJSON, setTitle } from '../scripts/utils';


// State action shorthand types
type SetIndex = Dispatch<SetStateAction<Index>>;
type OpenEntries = { [key: string]: ReactNode };
type SetOpenEntries = Dispatch<SetStateAction<OpenEntries>>;

// App context
interface IndexContextType { index: Index; }
export const IndexContext = createContext<IndexContextType>({ index: {} as Index });

const App: FC = () => {
  const [index, setIndex]: [Index, SetIndex] = useState<Index>({} as Index);

  const [openEntries, setOpenEntries]: [OpenEntries, SetOpenEntries] = useState<OpenEntries>({});

  const [entryRendered, SetEntryRendered] = useState<boolean>(false);
  const onEntryRendered = () => SetEntryRendered(true);

  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => {
    if (index.vault) setTitle(index.vault);
    if (index.homepage) openEntry(index.homepage);
  }, [index]);

  const openEntry = (entry: string) => {
    if (openEntries[entry]) return;

    const keyPath: string[] = entry.split('/');
    const indexEntry = keyPath.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, index.index as any);

    setOpenEntries(openEntries => ({ ...openEntries, [entry]: <Entry entry={indexEntry} path={entry} onRendered={onEntryRendered} onEntryAction={onEntryAction} /> }));
  }

  const closeEntry = (entry: string) => {
    setOpenEntries(openEntries => {
      if (!openEntries[entry]) return openEntries;

      const newOpenEntries = { ...openEntries };
      delete newOpenEntries[entry];
      return newOpenEntries;
    });
  }

  const onEntryAction = (entry: string, action: string) => {
    if (action === 'close') closeEntry(entry);
    else if (action === 'open') openEntry(entry);
  }

  return (
    <IndexContext.Provider value={{ index }}>
      <div className='left'>
        <Left openEntry={openEntry} />
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
        <Right openEntries={Object.values(openEntries)} entryRendered={entryRendered} />
      </div>
    </IndexContext.Provider>
  );
}

export default App;
