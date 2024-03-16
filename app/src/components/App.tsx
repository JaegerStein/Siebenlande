import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';

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
type SetOpenEntries = Dispatch<SetStateAction<ReactNode[]>>;

// App context
interface AppContextType {  index: Index;}
export const AppContext = createContext<AppContextType>({ index: {} as Index });

const App: FC = () => {
  const [index, setIndex]: [Index, SetIndex] = useState<Index>({} as Index);
  const [openEntries, setOpenEntries]: [ReactNode[], SetOpenEntries] = useState<ReactNode[]>([]);
  const openEntryList: string[] = [];

  const [entryRendered, SetEntryRendered] = useState<boolean>(false);
  const onEntryRendered = () => SetEntryRendered(true);
  // index
  useEffect(() => { loadJSON('index.json').then(data => setIndex(data)); }, []);
  useEffect(() => {
    if (index.vault) setTitle(index.vault);
    if (index.homepage) openEntry(index.homepage);
  }, [index]);

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
    <AppContext.Provider value={{index}}>
      <div className='left'>
        <Left openEntry={openEntry} />
      </div>
      <div className='center'>
        <Center>
          {openEntries || <></ >}
        </Center>
      </div>
      <div className='right'>
        <Right openEntries={openEntries} entryRendered={entryRendered} />
      </div>
    </AppContext.Provider>
  );
}

export default App;
