import { useContext } from "react";
import bx24Context from "./react-bx24-context";
import { BX24Context } from "./react-bx24-types";

const use24BX = () => {

    const _bx24Context:BX24Context  = useContext(bx24Context);
    
    return _bx24Context;
}

export default use24BX;