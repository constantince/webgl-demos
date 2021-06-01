import React, { useEffect } from "react";
import "./index.scss";
type Props = {
    height?: number,
    width?: number,
    main: {
        (id: string, func?: string) : void
    },
    id: string,
    children?: JSX.Element
}

const CanvasArea: React.FC<Props> = ({id, main, children}) => {

    useEffect(() => {
        main(id);
    },[])

    return <div className="new-scence">
            <header>
                <p className="title">title: CHEN YAN'S WEBGL LAB CHAPHTER 0: TEMPLATE</p>
                <p className="desc">here input your description for the chapter.</p>
            </header>
            <canvas id={id}></canvas>
            <div className="control-area">
                {children}
            </div>
        </div>
}

export default CanvasArea;