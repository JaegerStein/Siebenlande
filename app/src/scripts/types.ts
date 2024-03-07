type Index = {
    vault: string,
    attachments: string,
    index: any
}

type OpenEntry = (entry: string, middleMouse?: boolean) => void;

export type { Index, OpenEntry };
