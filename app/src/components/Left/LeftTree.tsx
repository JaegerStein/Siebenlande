import React, { FC, useEffect, useState } from 'react';
import {Index} from '../../scripts/types';
import TreeNode from './TreeNode';

interface LeftTreeProps { index: Index, openEntry: (entry: string) => void }

const LeftTree: FC<LeftTreeProps> = ({ index, openEntry }: LeftTreeProps) => {
    const [treeNodes, setTreeNodes] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (index.index) {
            const nodes = <TreeNode key="root" nodeName="" node={index.index} path="" openEntry={openEntry} />;
            setTreeNodes([nodes]);
        }
    }, [index]);

    return (
        <nav id='left-tree'>
            {treeNodes}
        </nav>
    );
};

export default LeftTree;