import { useEffect, useState } from 'react'
import { useSession } from '@providers/AuthProvider';
import { MsgType, useChat } from '@contexts/chat/ChatContext';
import { colors } from '../../../../../constants/color';
import MessageCardListMenu from '../listMenu/MessageCardListMenu';
import Cheked from './Cheked';
import { useSelectMessage } from '@contexts/chat/message/SelectMessageContext';
import { getHourTime } from '@utils/timeNotif';
import { useSearchMessage } from '@contexts/chat/message/SearchMessagteContext';
import { useMessage } from '@contexts/chat/MessageContext';
import ContactInfoCard from './ContactInfoCard';
import { PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import VideoCard from './VideoCard';
import { Icon } from '../../../../../constants/icons';
import AudioCard from './AudioCard';

function MessageCard({
    data,
    index
}: {
    data: MsgType,
    index: number
}) {

    const [tglList, setTglList] = useState(false);
    const [fade, setfade] = useState(true);
    const { message } = useMessage();
    const { select, fn: { handleSelect } } = useSelectMessage();
    const { user } = useSession();
    const { current } = useChat();
    const { fn: { handleRefClick } } = useSearchMessage();
    const nextMessage: MsgType | undefined = message[index + 1];

    useEffect(() => {
        const fadeAnimation = setTimeout(() => setfade(false), 200)

        return () => {
            clearTimeout(fadeAnimation)
        }
    }, [])

    const getExistForward = select.data.find(msg => msg.id === data.id) ? true : false;

    return (
        <div
            id={data.id}
            onClick={() => select.status ? handleSelect(data) : null}
            className={`w-full flex ${nextMessage?.info_msg.from !== data.info_msg.from ? "my-1 mb-4" : "my-1"} text-white ${getExistForward && "bg-bg-primary"} ${select.data.length >= 1 && "cursor-pointer"}`}
            style={{
                justifyContent: data.info_msg.from === user.username ? "flex-end" : "flex-start",
                opacity: fade ? "0" : "1"
            }}
        >

            {
                //  Action select.data if message exist on select.data array and msg from same xurrent user 
                select.status && data.info_msg.from !== user.username && (
                    <Cheked value={getExistForward} />
                )
                // Action select.data if message exist on select.data array
            }



            {
                data.info_msg.from !== user.username && current?.type === "group" &&
                <span className="w-[40px] h-[40px] mt-3 rounded-full flex justify-center items-center mr-3 bg-gray-500" >{data.info_msg.from.charAt(0).toUpperCase()}</span>
            }



            {/* Outer container message start */}
            <div>


                {/* Message Body Start */}
                <div
                    className={`${data.info_msg.from === user.username ? "bg-green-primary" : "bg-hover-color"} flex flex-col py-1 px-1 max-w-[36rem] group `}
                    style={{
                        position: "relative",
                        borderRadius: "6px"
                    }}
                >



                    {
                        data.forward && data.info_msg.from !== user.username && (
                            <div className='h-6 flex gap-1 italic px-1'>
                                <Icon name='arrow-right' />
                                <p className='text-sm text-icon-color'>Diteruskan</p>
                            </div>
                        )
                    }

                    {
                        data.info_msg.type === "edit" && (
                            <div className='h-6 px-3 flex gap-1 italic'>
                                <p className='text-sm text-icon-color'>Edited</p>
                            </div>
                        )
                    }

                    {
                        current?.type === "group" && data.info_msg.from !== user.username && (
                            <h5
                                style={{
                                    textAlign: data.info_msg.from === user.username ? "right" : 'left',
                                    color: ""
                                }}
                                className={`ml-1 text-sm pb-1`}
                            >
                                {data.info_msg.from === user.username ? "You" : data.info_msg.from}
                            </h5>
                        )
                    }

                    {
                        data.src && data.type === "photo" && data.msg !== "Pesan telah di hapus" ? (
                            <PhotoView src={data.src}>
                                <img src={data.src} className='w-[250px] rounded h-auto' alt="" />
                            </PhotoView>
                        ) : data.type === "files" ? (
                            <div className='w-52 bg-bg-secondary py-4 px-2 rounded text-white flex justify-between items-center pr-3'>
                                <div className='flex gap-1'>
                                    <span>
                                        <Icon name='files' size={35} />
                                    </span>
                                    <div>
                                        <h3 className='text-sm max-w-[69px] truncate'>{data.src?.split("/").pop()}</h3>
                                    </div>
                                </div>
                                <div className='p-1 rounded-full'>
                                    <a href={data.src + "?download=true"}>
                                        <Icon name='file-download' />
                                    </a>
                                </div>
                            </div>
                        ) : data.type === "video" ? (
                            <div className='bg-slate-700 w-80 h-44 object-contain'>
                                <VideoCard src={data.src!} />
                            </div>
                        ) : data.type === "audio" && (
                            <div className='bg-transparent w-80 h-10   object-contain'>
                                <AudioCard src={data.src!} />
                            </div>
                        )
                    }

                    {/* Toggle list message menu button start */}
                    {
                        select.data.length === 0 && (
                            <button
                                onClick={() => setTglList(pv => !pv)}
                                className={`absolute right-0 shadow-lg top-0 hidden rounded-full ${user.username === data.info_msg.from ? "bg-green-primary" : "bg-hover-color"} hidden group-hover:flex`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={30}
                                    height={30}
                                    id="angle-bottom-b">
                                    <path
                                        fill={colors.ICON_COLOR}
                                        d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"
                                    >
                                    </path>
                                </svg>
                            </button>
                        )
                    }
                    {/* Toggle list message menu button start */}


                    {/* Modal List menu message start*/}
                    {
                        tglList && (
                            <div className={`absolute ${message.length - index + 1 <= 3 && "bottom-0"} ${data.info_msg.from !== user.username ? "left-full ml-2" : "right-full mr-2"}`}>
                                <div className='fixed top-0 z-10 left-0 min-h-screen w-full' onClick={() => setTglList(pv => !pv)}></div>
                                <MessageCardListMenu
                                    msg={data}
                                    setTgl={setTglList}
                                />
                            </div>
                        )
                    }
                    {/* Modal List menu message End*/}





                    {/* Message Reply Cards start */}
                    {
                        data.pull_msg && data.msg !== "Pesan telah di hapus" && (
                            <div style={{
                                padding: 6,
                                marginBottom: 3,
                                borderRadius: 6,
                            }}
                                onClick={() => handleRefClick(data.pull_msg?.id!)}
                                className={`${data.info_msg.from === user.username ? "bg-green-secondary" : "bg-bg-thridht"} gap-5 flex justify-between h-auto rounded-2xl border-l-4 border-green-accent`}
                            >

                                <div>
                                    <h6
                                        style={{ marginBottom: 4 }}
                                        className='text-green-accent'
                                    >
                                        {data.pull_msg.info_msg.from === user.username ? "Kamu" : data.pull_msg.info_msg.from}
                                    </h6>
                                    <p>{data.pull_msg.msg}</p>
                                </div>

                                {
                                    data.pull_msg.src && (
                                        data.pull_msg.type === "photo" ?
                                            <PhotoView src={data.pull_msg.src}>
                                                <img src={data.pull_msg.src} className='h-[60px] aspect-square rounded' alt={data.pull_msg.src} />
                                            </PhotoView> :
                                            <Icon name='files' size={45} classname='p-2' />
                                    )
                                }
                            </div>
                        )
                    }
                    {/* Message Reply Cards End */}



                    {/* Message content */}
                    {
                        data.type === "contact" ?
                            <ContactInfoCard data={data} /> : (
                                <div className='flex w-full items-end gap-2'>
                                    <p className={`px-1 w-full pb-2 ${data.msg === "Pesan telah di hapus" && "italic font-thin text-gray-300"}`}>
                                        {data.msg}
                                    </p>
                                    <span
                                        style={{
                                            textAlign: data.info_msg.from === user.username ? "right" : "left"
                                        }}
                                        className='text-icon-color text-[12px] w-fit px-1'
                                    >
                                        {getHourTime(data.time)}
                                    </span>
                                </div>
                            )
                    }
                    {/* Message content */}


                    {
                        nextMessage?.info_msg.from !== data.info_msg.from && (
                            <div className={`absolute flex  z-5 ${data.info_msg.from === user.username ? "right-0" : "left-0"} -bottom-2`}>
                                <div
                                    style={{
                                        borderRadius: data.info_msg.from === user.username ? "50px 100px 0px 200px" : "50px 0px 200px 0px"
                                    }}
                                    className={`h-4 aspect-square ${data.info_msg.from === user.username ? "bg-green-primary" : "bg-hover-color"}`}
                                ></div>
                            </div>
                        )
                    }
                </div>
                {/* Message Body End */}


            </div>
            {/* Outer container message end */}



            {
                //  Action select.data if message exist on select.data array and msg from not equal xurrent user 
                select.status && data.info_msg.from === user.username && (
                    <Cheked value={getExistForward} />
                )
                //  Action select.data if message exist on select.data array 
            }


        </div>
    )
}

export default MessageCard
