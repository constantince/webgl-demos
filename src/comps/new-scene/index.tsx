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

const CanvasArea: React.FC<Props> = ({id, height = 500, width = 500, main, children}) => {

    useEffect(() => {
        main(id);
    },[])

    return <div className="new-scence">
            <canvas id={id} height={height} width={width}></canvas>
            <div className="control-area">
                {children}
            </div>
        </div>
}

export default CanvasArea;