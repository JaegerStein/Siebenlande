import React, { FC, useState } from 'react';
import Link from '../common/Link';
import { OpenEntry } from '../../scripts/types';

interface TreeNodeProps {
  node: any;
  nodeName: string;
  path: string;
  openEntry: OpenEntry;
}

const appendPath = (path: string, nodeName: string) => `${path}${path ? '/' : ''}${nodeName}`;

const TreeNode: FC<TreeNodeProps> = ({ node, nodeName, path, openEntry }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isFolder = typeof node === 'object' && !node.hasOwnProperty('title');

  const handleClick = () => setIsOpen(!isOpen);

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

  const sortedKeys = sortKeys(node);
  const children = sortedKeys.map((key) => (
    <TreeNode
      key={key}
      node={node[key]}
      nodeName={key}
      path={appendPath(path, nodeName)}
      openEntry={openEntry}
    />
  ));

  console.log(children);

  if (!nodeName) {
    return (
      <div>
        {children}
      </div>
    );
  }

  else if (isFolder) {
    return (
      <div>
        <div onClick={handleClick}>
          {isOpen ? '[-]' : '[+]'}
          {nodeName}
        </div>
        {isOpen && children}
      </div>
    );
  }

  return (
    <div>
      <Link to={appendPath(path, nodeName)} onClick={openEntry}>{node.title}</Link>
    </div>
  );
};

export default TreeNode;