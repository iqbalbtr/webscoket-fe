export type TypeMsg = "video" | "photo" | "files" | "idle" | "contact" | "audio"
export type SendingMsg = {
    input: string,
    to: string,
    type: "group" | "private" | "edit",
    pull?: string,
    fwd?: boolean,
    file?: File,
    typeFile?: TypeMsg,
    src?: string;
    idEdit?: string
}