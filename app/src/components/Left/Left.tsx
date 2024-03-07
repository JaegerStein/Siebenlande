import React, { FC } from "react";
import { Index, OpenEntry } from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

interface LeftProps { index: Index; openEntry: OpenEntry; }

const Left: FC<LeftProps> = ({ index, openEntry }: LeftProps) => {
    return (
        <div>
            <h1>{index.vault}</h1>
            <Searchbar />
            <LeftTree index={index} openEntry={openEntry} />
        </div>
    );
}

export default Left;