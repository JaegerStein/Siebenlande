interface Index {
    vault: string;
    attachments: string;
    homepage: string;
    index: (IndexFolder | IndexEntry)[];
}

interface IndexFolder {
    contents?: (IndexFolder | IndexEntry)[]
}

enum EntryAction {
    OPEN = 'open',
    CLOSE = 'close'
}

interface IndexEntry {
    title: string;
    created_time: number;
    last_modified_time: number;
    uid: string;
    aliases?: string[];
    tags?: string[];
}

type OpenEntry = (entry: string, middleMouse?: boolean) => void;

export type { Index, EntryAction, IndexFolder, IndexEntry, OpenEntry };


