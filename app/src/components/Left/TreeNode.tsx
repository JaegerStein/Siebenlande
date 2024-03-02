import React, { FC, useState } from 'react';

interface TreeNodeProps { node: any; nodeName: string; }
interface FileNodeProps { node: any; }

const FolderNode: FC<TreeNodeProps> = ({ node, nodeName }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleClick = () => setIsOpen(!isOpen);

    return (
        <div>
            <div onClick={handleClick}>
                {isOpen ? '[-]' : '[+]'}
                {nodeName}
            </div>
            {isOpen && Object.keys(node).map((key) => <TreeNode key={key} nodeName={key} node={node[key]} />)}
        </div>
    );
}

const FileNode: FC<FileNodeProps> = ({ node }: FileNodeProps) => {
    return (
        <div>
            {node.title}
        </div>
    );
}

export const TreeNode: FC<TreeNodeProps> = ({ node, nodeName }: TreeNodeProps) => {
    const isFolder = typeof node === 'object' && !node.hasOwnProperty('title');

    return isFolder ? <FolderNode node={node} nodeName={nodeName} /> : <FileNode node={node} />;

};
