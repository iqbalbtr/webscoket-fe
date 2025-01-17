import { useEffect, useState } from 'react'
import { useSendFile } from '@contexts/chat/message/SendFileContext';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import ReactPlayer from 'react-player';
import PhotoCardInput from './PhotoCardInput';
import { Icon } from '../../../../../../../constants/icons';

export default function SendPhoto() {

    const [text, setText] = useState("")
    const { files, fn: { handleAddFile, handleRemove, handleResetFile, handleEditFile, handleSendFile } } = useSendFile();
    const { fn: { handleInnerMessage } } = useRouterMessage()
    const [index, setIndex] = useState(0);
    const currentFile = files[index];

    function handleBack() {
        handleInnerMessage("back");
        handleResetFile();
    }

    useEffect(() => {
        const curFile = files[index];
        if (curFile) {
            handleEditFile(curFile.url, { type: "text", value: text });
        }
    }, [text, index])

    useEffect(() => {
        const curFile = files[index];
        if (curFile) {
            if (curFile.text) {
                setText(curFile.text)
            } else {
                setText('')
            }
        }
    }, [index])

    function handleChange(file: Blob) {
        handleEditFile(currentFile.url, { type: "file", value: file })
        handleEditFile(currentFile.url, { type: "url", value: URL.createObjectURL(file) })
    }


    return (
        <div className='h-full w-full flex justify-center top-0 left-0 bg-bg-secondary z-[999]'>
            <div className="flex flex-col w-full items-center py-6 relative">
                <div className="p-6 absolute top-0 left-0 text-white">
                    <button
                        onClick={handleBack}
                    >
                        <Icon name='times' />
                    </button>
                </div>
                <div className="relativ p-10 text-white">
                    {
                        currentFile.type.includes("photo") && currentFile.compress ?
                            <PhotoCardInput handleChange={handleChange} src={currentFile.url} /> :
                            currentFile.type.includes("video") ? (
                                <div className='w-full h-[50vh] flex items-center'>
                                    <div className='max-w-full max-h-full overflow-x-scroll'>
                                        <ReactPlayer height={"100%"} width={"100%"} url={currentFile.url} controls />
                                    </div>
                                </div>
                            ) :
                                (
                                    <div className='object-contain aspect-square h-[50vh] flex flex-col items-center'>
                                        <h3
                                            className=" flex justify-center items-center text-center max-w-[16rem] line-clamp-2 text-white"
                                        >
                                            {currentFile.file.name}
                                        </h3>
                                        <div className='flex flex-col gap-3 justify-center items-center mt-24'>
                                            <Icon name='files' size={105} />
                                            <p>{(currentFile.file.size / 1024 / 1024).toFixed(1)} MB - {currentFile.file.name.split(".").pop()}</p>
                                        </div>
                                    </div>
                                )
                    }
                </div>
                <div className="my-6 text-white">
                    <input
                        type="text"
                        className="w-[500px] bg-bg-primary rounded-sm p-1"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="w-full flex justify-center relative text-white border-hover-color border-t p-6">
                    <div className="flex gap-2">
                        {
                            files.map((foo, i) => (
                                <div className="relative group" key={foo.url} >
                                    {
                                        i > 0 &&
                                        <button className="group-hover:block absolute right-0 top-0 m-1 hidden"
                                            onClick={() => {
                                                setIndex(pv => pv >= 1 ? --pv : pv)
                                                handleRemove(foo.file)
                                            }}
                                        >
                                           <Icon name='times' />
                                        </button>
                                    }

                                    {
                                        foo.type.includes("photo") ?
                                            <img
                                                src={foo?.url!}
                                                onClick={(e) => {
                                                    setIndex(i)
                                                    e.stopPropagation()
                                                }}
                                                className={`w-[50px] h-[50px] object-cover rounded cursor-pointer ${index === i && "outline outline-2 outline-green-accent"}`} alt=""
                                            /> : (
                                                <div
                                                    className={`w-[50px] h-[50px] object-cover border-2 rounded cursor-pointer flex justify-center items-center ${index === i && "border-2 border-green-accent"}`}
                                                    onClick={(e) => {
                                                        setIndex(i)
                                                        e.stopPropagation()
                                                    }}
                                                >
                                                    <Icon name='files' size={35} />
                                                </div>
                                            )
                                    }
                                </div>
                            ))
                        }
                        <div className="w-[50px] h-[50px] border-2 rounded relative flex justify-center items-center text-3xl text-white">
                            <span className="p-1 mb-1">+</span>
                            <input
                                className="opacity-0 absolute cursor-pointer top-0 left-0 right-0 bottom-0"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        handleAddFile(e.target.files[0], "", true)
                                    }
                                }}

                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSendFile}
                        className="p-2 rounded-full bg-green-accent absolute right-6"
                    >
                        <Icon name='arrow-right' size={35} />
                    </button>
                </div>
            </div>
        </div>
    )
}
