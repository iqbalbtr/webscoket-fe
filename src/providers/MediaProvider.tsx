import React from "react";
import { ReactMediaRecorderRenderProps, useReactMediaRecorder } from "react-media-recorder";

type ContextType = ReactMediaRecorderRenderProps | null

const Context = React.createContext<ContextType>(null);

export function useMedia() {
    return React.useContext(Context);
}

function MediaProvider(props: { children: React.ReactNode }) {

    const media = useReactMediaRecorder({
        audio: true
    })

    return (
        <Context.Provider value={media}>
            {props.children}
        </Context.Provider>
    )
}

export default MediaProvider
