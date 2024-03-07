import React, { FC, useState } from 'react';
import Link from '../common/Link';
import { OpenEntry } from '../../scripts/types';

interface TreeNodeProps {
  node: any;
  nodeName: string;
  path: string;
  depth?: number;
  openEntry: OpenEntry;
}

const sortKeys = (node: any) => {
  return Object.keys(node).sort((a, b) => {
    const isAFolder = typeof node[a] === 'object' && !node[a].hasOwnProperty('title');
    const isBFolder = typeof node[b] === 'object' && !node[b].hasOwnProperty('title');

    if (isAFolder === isBFolder) {
      return a.localeCompare(b);
    }

    return isAFolder ? -1 : 1;
  });
}

const appendPath = (path: string, nodeName: string) => `${path}${path ? '/' : ''}${nodeName}`;

const TreeNode: FC<TreeNodeProps> = ({ node, nodeName, path, depth = -1, openEntry }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isFolder = typeof node === 'object' && !node.hasOwnProperty('title');

  const handleFolderClick = () => setIsOpen(!isOpen);

  const sortedKeys = sortKeys(node);
  const children = sortedKeys.map((key) => (
    <TreeNode
      key={key}
      node={node[key]}
      nodeName={key}
      path={appendPath(path, nodeName)}
      depth={depth + 1}
      openEntry={openEntry}
    />
  ));

  if (!nodeName) {
    return (
      <div>
        {children}
      </div>
    );
  }

  else if (isFolder) {
    return (
      <div className={`depth-${depth}`}>
        <div onClick={handleFolderClick}>
          {isOpen ? '[-]' : '[+]'}
          {nodeName}
        </div>
        {isOpen && children}
      </div>
    );
  }

  return (
    <div className={`depth-${depth}`}>
      <Link to={appendPath(path, nodeName)} onClick={openEntry}>{node.title}</Link>
    </div>
  );
};

export default TreeNode;