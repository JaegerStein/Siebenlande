// types for the index.json file
interface Index {
    vault: string;
    attachments: string;
    homepage: string;
    index: (IndexFolder | IndexEntry)[];
}
interface IndexFolder {
    contents?: (IndexFolder | IndexEntry)[]
}
interface IndexEntry {
    title: string;
    created_time: number;
    last_modified_time: number;
    uid: string;
    aliases?: string[];
    tags?: string[];
}
export type { Index, IndexFolder, IndexEntry };

type OpenEntry = (entry: string, middleMouse?: boolean) => void;
export type { OpenEntry };

enum EntryAction {
    OPEN = 'open',
    CLOSE = 'close'
}
export {EntryAction}