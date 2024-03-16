import React, { FC, useContext } from "react";
import { Index, OpenEntry } from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

import '../../styles/Left.scss';
import { EntryContext, IndexContext } from "../App";

const Left: FC = () => {
    const {index} = useContext(IndexContext);
    
    return (
        <div>
            <h1>{index.vault}</h1>
            <Searchbar />
            <LeftTree />
        </div>
    );
}

export default Left;