import React, { FC } from 'react';
import logo from './logo.svg';
import '@style/App.scss';

const mockVault = {
  name: 'Vault',
  type: 'folder' as const,
  children: [
    {
      name: 'Folder1',
      type: 'folder' as const,
      children: [
        { name: 'File1.md', type: 'file' as const },
        { name: 'File2.md', type: 'file' as const },
      ],
    },
    {
      name: 'Folder2',
      type: 'folder' as const,
      children: [
        { name: 'File3.md', type: 'file' as const },
        {
          name: 'Subfolder1',
          type: 'folder' as const,
          children: [
            { name: 'File4.md', type: 'file' as const },
          ],
        },
      ],
    },
  ],
};

interface FileNode {
  name: string;
  type: 'file';
}

interface FolderNode {
  name: string;
  type: 'folder';
  children: Node[];
}

type Node = FileNode | FolderNode;

const renderTree = (node: Node): JSX.Element => {
  if (node.type === 'file') {
    return <li key={node.name}>{node.name}</li>;
  }

  return (
    <li key={node.name}>
      {node.name}
      <ul>
        {node.children.map((child) => renderTree(child))}
      </ul>
    </li>
  );
};

const App: FC = () => {
  return (
    <>
      <div id="left">
        <header></header>
        <nav>
          <ul>
            {renderTree(mockVault)}
          </ul>
        </nav>
      </div>
      <div id="center">
        <main></main>
      </div>
      <div id="right">
        <aside></aside>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
