import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Icon } from '../../../../../constants/icons';

const format = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
};

const pad = (string: number) => (`0${string}`).slice(-2);

const Duration = ({ className, seconds }: any) => (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
        {format(seconds)}
    </time>
);


function VideoCard({ src }: { src: string }) {
    const [state, setState] = useState({
        once: false,
        url: null,
        pip: false,
        playing: false,
        controls: false,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        volumeOpen: false,
        dropdownOpen: false,
        fullscreen: false,
        seeking: false
    });
    const player = useRef(null) as any

    const handlePlayPause = () => {
        setState({ ...state, playing: !state.playing, once: true });
    };

    const handlePlay = () => {
        if (!state.playing) {
            setState({ ...state, playing: true });
        }
    };

    const handleVolumeChange = (e: any) => {
        setState({ ...state, volume: parseFloat(e.target.value) });
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
                volume={state.volume}
                muted={state.muted}
                onPlay={handlePlay}
                onProgress={handleProgress}
                onReady={handlePlayPause}
                onDuration={handleDuration}
            />
            {
                state.once ? (
                    <div className="w-full absolute items-center py-1 bottom-0 px-2 bg-black/20 backdrop-blur-sm flex justify-between gap-3">
                        <button type="button" onClick={() => handlePlayPause()} className="play-pause pr-2">
                            <Icon color="#fff" name={state.playing ? "pause" : "play"} size={20} />
                        </button>
                        <Duration seconds={state.duration * (1 - state.played)} className="time pl-2" />
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
                        <p>{format(state.duration)}</p>
                        <div className='relative'>
                            {
                                state.volumeOpen && 
                                <input className="absolute -left-[90%] -top-[175%] w-[70px] rotate-[270deg] h-1 bg-green-600 rounded-lg appearance-none cursor-pointe" width="50px" type="range" min={0} max={1} step="any" value={state.volume} onChange={handleVolumeChange} />
                            }
                            <button type="button" onClick={() => setState({ ...state, volumeOpen: !state.volumeOpen })} className="play-pause pr-2">
                                <Icon color="#fff" name="volume" size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={() => handlePlayPause()} className="play-pause pr-2">
                        <Icon color="#fff" name="play" size={45} classname='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2' />
                    </button>
                )
            }
        </div>
    );
}

export default VideoCard;
