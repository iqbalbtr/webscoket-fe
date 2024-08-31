import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Icon } from '../../../../../constants/icons';

function AudioCard({ src }: { src: string }) {
    const [state, setState] = useState({
        url: null,
        pip: false,
        playing: false,
        controls: false,
        light: false,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        dropdownOpen: false,
        fullscreen: false,
        seeking: false
    });
    const player = useRef(null) as any

    const handlePlayPause = () => {
        setState({ ...state, playing: !state.playing});
    };

    const handlePlay = () => {
        if (!state.playing) {
            setState({ ...state, playing: true });
        }
    };

    const handleProgress = (stateIn: any) => {        
        setState({ ...state, ...stateIn });
    };

    const handleSeekMouseDown = () => {
        setState({ ...state, seeking: true });
    };

    const handleSeekChange = (e: any) => {
        setState({ ...state, played: parseFloat(e.target.value) });
    };

    const handleSeekMouseUp = (e: any) => {
        setState({ ...state, seeking: false });
        if (player?.current) {
            player.current?.seekTo(parseFloat(e.target.value));
        }
    };

    const handleDuration = (duration: number) => {        
        setState({ ...state, duration });
    };

    return (
        <div className='relative'>
            <ReactPlayer
                className="react-player"
                ref={player}
                url={src}
                width="100%"
                height="100%"
                pip={state.pip}
                playing={state.playing}
                controls={state.controls}
                loop={state.loop}
                playbackRate={state.playbackRate}
                muted={state.muted}
                onProgress={handleProgress}
                onReady={handlePlayPause}
                onDuration={handleDuration}
                onPlay={handlePlay}
            />
            <div className="w-full absolute items-center py-2 px-2 flex justify-between gap-3">
                        <button type="button" onClick={() => handlePlayPause()} className="play-pause pr-2">
                            <Icon color="#fff" name={state.playing ? "pause" : "play"} size={20} />
                        </button>
                        {/* <Duration seconds={state.duration * (1 - state.played)} className="time pl-2" /> */}
                        <input
                            type="range"
                            className="w-full h-1 bg-green-600 rounded-lg appearance-none cursor-pointe"
                            min={0}
                            max={0.999999}
                            step="any"
                            value={state.played}
                            onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                        />
                        {/* <p>{player.current.duration}</p> */}
                    </div>
        </div>
    );
}

export default AudioCard;
