abstract class IndexNode {
    constructor() { }
}

class FolderNode extends IndexNode {

    public readonly children: IndexNode[] = [];

    constructor() {
        super();
    }

    public addChild(child: IndexNode): void {
        this.children.push(child);
    }
}

class FileNode extends IndexNode {
    public readonly path: string;
    public readonly fileName: string;
    private readonly createdTimestamp: number;
    private readonly editedTimestamp: number;

    constructor(path: string, createdTimestamp: number, editedTimestamp: number) {
        super();
        this.path = path;
        this.fileName = path.split('/').pop()!.split('.').shift()!;
        this.createdTimestamp = createdTimestamp;
        this.editedTimestamp = editedTimestamp;
    }

    public get created(): Date {
        return new Date(this.createdTimestamp);
    }

    public get edited(): Date {
        return new Date(this.editedTimestamp);
    }

}

export { IndexNode, FolderNode, FileNode };