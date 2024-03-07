import React, { FC, useEffect, useState } from 'react';
import {Index} from '../../scripts/types';
import TreeNode from './TreeNode';

interface LeftTreeProps { index: any, openEntry: (entry: string) => void }

const LeftTree: FC<LeftTreeProps> = ({ index, openEntry }: LeftTreeProps) => {
    const [treeNodes, setTreeNodes] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (index.index) {
            const root = index.index;
            const nodes = <TreeNode key={root.key} nodeName={root.key} node={index.index} path="" openEntry={openEntry} />;
            console.log(nodes);
            
            setTreeNodes([nodes]);
        }
    }, [index]);

    return (
        <div id='left-tree'>
            {treeNodes}
        </div>
    );
};

export default LeftTree;