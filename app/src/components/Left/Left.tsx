import React, { FC, useContext } from "react";
import { Index, OpenEntry } from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

import '../../styles/Left.scss';
import { IndexContext } from "../App";

interface LeftProps { openEntry: OpenEntry; }

const Left: FC<LeftProps> = ({openEntry }: LeftProps) => {
    const {index} = useContext(IndexContext);
    return (
        <div>
            <h1>{index.vault}</h1>
            <Searchbar />
            <LeftTree openEntry={openEntry} />
        </div>
    );
}

export default Left;