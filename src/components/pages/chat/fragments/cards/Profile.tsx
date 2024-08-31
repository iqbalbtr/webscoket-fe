
function Profile({ username, width = 44, src }: { username: string, width?: number, src?: string }) {

    return (
        <div>
            {src ? (
                <img src={src}
                    style={{
                        width: width,
                        aspectRatio: 1 / 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        background: "#2563eb"
                    }}
                    alt="" />
            ) : (
                <span
                    style={{
                        width: width,
                        aspectRatio: 1 / 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        background: "#2563eb"
                    }}
                >{username.charAt(0).toUpperCase()}</span>
            )}
        </div>
    )
}

export default Profile
