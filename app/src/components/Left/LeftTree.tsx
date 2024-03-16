import React, { FC, useContext, useEffect, useState } from 'react';
import {Index} from '../../scripts/types';
import TreeNode from './TreeNode';
import { AppContext } from '../App';

interface LeftTreeProps { openEntry: (entry: string) => void }

const LeftTree: FC<LeftTreeProps> = ({openEntry }: LeftTreeProps) => {
    const [treeNodes, setTreeNodes] = useState<JSX.Element[]>([]);
    const {index} = useContext(AppContext);

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