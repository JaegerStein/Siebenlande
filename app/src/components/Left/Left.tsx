import React, { FC, useContext } from "react";
import { Index, OpenEntry } from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

import '../../styles/Left.scss';
import { EntryContext, IndexContext } from "../App";
import Tag from "../common/Tag";

const Left: FC = () => {
    const {index} = useContext(IndexContext);
    
    return (
        <div>
            <h1>{index.vault}</h1>
            <Tag>REMtag</Tag>
            <Searchbar />
            <LeftTree />
        </div>
    );
}

export default Left;