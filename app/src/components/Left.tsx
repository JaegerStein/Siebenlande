import exp from "constants";
import React, { FC } from "react";
import Index from "../scripts/types";

interface LeftProps { index: Index }

const Left: FC<LeftProps> = ({ index }: LeftProps) => {
    console.log(index);
    return (
        <div>
            <h1>{index.vault}</h1>
        </div>
    );
}

export default Left;