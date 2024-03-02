import React, { FC } from "react";
import Index from "../../scripts/types";
import Searchbar from "./Searchbar";
import LeftTree from "./LeftTree";

interface LeftProps { index: Index }

const Left: FC<LeftProps> = ({ index }: LeftProps) => {
    return (
        <div>
            <h1>{index.vault}</h1>
            <Searchbar />
            <LeftTree index={index.index} />
        </div>
    );
}

export default Left;