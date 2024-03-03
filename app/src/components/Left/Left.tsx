import React, { FC } from "react";
import Index from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

interface LeftProps { index: Index, openEntry: (entry: string) => void; }

const Left: FC<LeftProps> = ({ index, openEntry }: LeftProps) => {
    return (
        <div>
            <h1>{index.vault}</h1>
            <Searchbar />
            <LeftTree index={index.index} openEntry={openEntry} />
        </div>
    );
}

export default Left;