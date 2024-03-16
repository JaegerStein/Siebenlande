import React, { FC, useContext, useEffect, useState } from 'react';
import {Index} from '../../scripts/types';
import TreeNode from './TreeNode';
import { IndexContext } from '../App';

const LeftTree: FC = () => {
    const [treeNodes, setTreeNodes] = useState<JSX.Element[]>([]);
    const {index} = useContext(IndexContext);

    useEffect(() => {
        if (index.index) {
            const nodes = <TreeNode key="root" nodeName="" node={index.index} path="" />;
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