import React, { FC, useState } from 'react';
import Link from '../common/Link';

interface TreeNodeProps { 
  node: any; 
  nodeName: string; 
  path: string; 
  openEntry: (entry: string) => void; 
}

const appendPath = (path: string, nodeName: string) => `${path}${path ? '/' : ''}${nodeName}`;

const TreeNode: FC<TreeNodeProps> = ({ node, nodeName, path, openEntry }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isFolder = typeof node === 'object' && !node.hasOwnProperty('title');
  
  const handleClick = () => setIsOpen(!isOpen);

  if (isFolder) {
    return (
      <div>
        <div onClick={handleClick}>
          {isOpen ? '[-]' : '[+]'}
          {nodeName}
        </div>
        {isOpen && Object.keys(node).map((key) => (
          <TreeNode
            key={key}
            node={node[key]}
            nodeName={key}
            path={appendPath(path, nodeName)}
            openEntry={openEntry}
          />
        ))}
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