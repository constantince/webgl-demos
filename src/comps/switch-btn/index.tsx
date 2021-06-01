import React from "react";
import "./index.scss";
type Props = {
    href: string
}
const SwitchBtn:React.FC<Props> = ({href}) => {

    return <div className="swither">
        <a href={href} className="swith-source" target="_blank">source code</a>
        <a className="swith-viewer">view</a>
    </div>
}

export default SwitchBtn;