import { NotifType } from "@contexts/NotificationContext";
import { Icon } from "../../../../../constants/icons";

export default function NotifCard({ data, handle }: { data?: NotifType, handle: (id: number) => void }) {
    return (
        <div className='px-4 py-2 animate-slide-right border-2 transition-opacity flex items-start rounded-md gap-4 border-accent-hover-color bg-hover-color text-white overflow-hidden'>
            <i className={`mt-2 rounded-full ${data?.type == "error" ? "bg-danger" : data?.type == "alert" ? "bg-orange-400" : "bg-green-primary" }`}>
                <Icon classname="p-2" size={40} name={data?.type == "success" ? "check" : data?.type === "user" ? "chat" : data?.type == "error" ? "exclamation" : "bell"} />
            </i>
            <div className='w-full'>
                <div className='border-b-2 flex justify-between w-full border-accent-hover-color py-1 font-bold text-icon-color'>
                    <h4>{data?.title ?? "Alert"}</h4>
                    <button className='active:scale-90' onClick={() => handle(data?.id!)}>
                        <Icon name='times' />
                    </button>
                </div>
                <p className='w-[400px] pb-1 pt-2'>
                    {data?.message}
                </p>
                {
                    data?.btntitle &&
                    <button
                        className='py-2 px-6 bg-green-primary text-white font-semibold'
                        onClick={data.onSuccess}
                    >
                        {data.btntitle}
                    </button>
                }
            </div>
        </div>
    );
}
