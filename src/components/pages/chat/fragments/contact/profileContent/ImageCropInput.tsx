import React, { useState, useRef, Dispatch, SetStateAction } from 'react'
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from '../../../../../../hooks/useDebounceEffect'
import { canvasPreview } from '../../../../../../utils/canvasPreview'


function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageCropInput({ setTgl, setHandle, data }: {
    setTgl: Dispatch<SetStateAction<boolean>>,
    setHandle: Dispatch<SetStateAction<{ file?: Blob, url: string }>>,
    data: { file?: Blob, url: string }
}) {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, 1 / 1))
    }

    async function onDownloadCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }

        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height,
        )
        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        setHandle({
            url: URL.createObjectURL(blob),
            file: blob
        })

       setTgl(false)
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    1,
                    0,
                )
            }
        },
        100,
        [completedCrop]
    )

    return (
        <div className='my-12 overflow-hidden'>
            <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1 / 1}
                minHeight={50}
                circularCrop
            >
                <img
                    ref={imgRef}
                    className='rounded-md pointer-events-none'
                    alt="Crop"
                    src={data.url}
                    onLoad={onImageLoad}
                />
            </ReactCrop>
            <canvas
                hidden
                ref={previewCanvasRef}
            />
            <div>
                <button className=' px-8 py-2 w-full bg-green-primary rounded-md text-icon-color' onClick={onDownloadCropClick}>Save</button>
            </div>
        </div>
    )
}
