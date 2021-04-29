import React from "react";

interface P {
    name?: string,
    index: number
}
interface U {
    set: []
}

const my = <P extends U> (art: P): P =>{
    return art;
}

const FirstComp : React.FC<P>= (p) : JSX.Element => {
    const t = my({set: [], name: "sss", index:"3"});
    return <h1>First-comp</h1>
}

export default FirstComp;