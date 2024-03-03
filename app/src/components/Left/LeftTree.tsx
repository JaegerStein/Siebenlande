import React, { FC, useEffect, useState } from 'react';
import Index from '../../scripts/types';
import TreeNode from './TreeNode';

interface LeftTreeProps { index: any, openEntry: (entry: string) => void }

const LeftTree: FC<LeftTreeProps> = ({ index, openEntry }: LeftTreeProps) => {
    const [treeNodes, setTreeNodes] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (index) {
            const nodes = Object.keys(index).map((key) => <TreeNode key={key} nodeName={key} node={index[key]} path="" openEntry={openEntry} />);
            setTreeNodes(nodes);
        }
    }, [index]);

    return (
        <div>
            {treeNodes}
        </div>
    );
};

export default LeftTree;