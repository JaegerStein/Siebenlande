import React, { FC, useContext, useState } from 'react';
import Link from '../common/Link';
import { EntryAction, OpenEntry } from '../../scripts/types';
import { ReactComponent as V } from '../../assets/v.svg';
import { EntryContext } from '../App';

interface TreeNodeProps {
  node: any;
  nodeName: string;
  path: string;
  depth?: number;
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

const TreeNode: FC<TreeNodeProps> = ({ node, nodeName, path, depth = -1 }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isFolder = typeof node === 'object' && !node.hasOwnProperty('title');

  const {entryAction} = useContext(EntryContext)!;
  const openEntry = (entry: string) => entryAction(entry, EntryAction.OPEN);

  const handleFolderClick = () => setIsOpen(!isOpen);

  const sortedKeys = sortKeys(node);
  const children = sortedKeys.map((key) => (
    <TreeNode
      key={key}
      node={node[key]}
      nodeName={key}
      path={appendPath(path, nodeName)}
      depth={depth + 1}
    />
  ));

  if (!nodeName) {
    return (
      <>
        {children}
      </>
    );
  }

  else if (isFolder) {
    return (
      <div className={`depth-${depth}`}>
        <div onClick={handleFolderClick} className='left-folder flex ai-center'>
          <V className={`v ${isOpen ? 'rotate' : ''}`} />
          {nodeName}
        </div>
        {isOpen && children}
      </div>
    );
  }

  return (
    <div className={`depth-${depth}`}>
      <Link className="left-link" to={appendPath(path, nodeName)} onClick={openEntry}>{node.title}</Link>
    </div>
  );
};

export default TreeNode;