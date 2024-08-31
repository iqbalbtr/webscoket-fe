import { useDebounceEffect } from '@hooks/useDebounceEffect'
import { useState, useRef } from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from '../../../../../../../utils/canvasPreview'
import { Icon } from '../../../../../../../constants/icons'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
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

export default function PhotoCardInput({
    src,
    handleChange
}: {
    src: string,
    handleChange: (file: Blob) => void
}) {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(undefined)
    const [isActive, setActive] = useState(false)

    async function onDownloadCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        // This will size relative to the uploaded image
        // size. If you want to size according to what they
        // are looking at on screen, remove scaleX + scaleY
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
        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        });

        handleChange(blob)
        setCrop(undefined)
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    function handleToggleAspectClick(val: number) {
        if (aspect === val) {
            setAspect(undefined)
        } else {
            setAspect(val)

            if (imgRef.current) {
                const { width, height } = imgRef.current
                const newCrop = centerAspectCrop(width, height, val)
                setCrop(newCrop)
                // Updates the preview
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <div className='flex gap-12 text-white'>
                <div className='flex gap-3 bg-bg-primary p-1 px-3 rounded-md items-center'>
                    <h5>Aspect</h5>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => handleToggleAspectClick(1 / 1)}
                            className={`border-2 ${aspect === 1/1 && "bg-accent-hover-color"} rounded-md p-1.5 border-accent-hover-color bg-transparent`}>1/1</button>
                        <button
                            onClick={() => handleToggleAspectClick(3 / 4)}
                            className={`border-2 ${aspect === 3/4 && "bg-accent-hover-color"} rounded-md p-1.5 border-accent-hover-color bg-transparent`}>3/4</button>
                        <button
                            onClick={() => handleToggleAspectClick(9 / 16)}
                            className={`border-2 ${aspect === 9/16 && "bg-accent-hover-color"} rounded-md p-1.5 border-accent-hover-color bg-transparent`}>9/16</button>
                    </div>
                </div>
                <div className='flex gap-3 bg-bg-primary p-1 px-3 rounded-md items-center'>
                    <h5>Scale</h5>
                    <div className='flex gap-4 items-center'>
                        <button
                            onClick={() => scale >= 1 &&  setScale(scale - .1)}
                            className='border-2 rounded-md p-1.5 border-accent-hover-color bg-transparent w-10'>-</button>
                        <p>{Math.floor(scale * 10) % 10}</p>
                        <button
                            onClick={() => setScale(scale + .1)}
                            className='border-2 rounded-md p-1.5 border-accent-hover-color bg-transparent w-10'>+</button>
                    </div>
                </div>
                <div className='flex gap-3 bg-bg-primary p-1 px-3 rounded-md items-center'>
                    <h5>Rotate</h5>
                    <div className='flex gap-4 items-center'>
                        <button
                            disabled={rotate < 0}
                            onClick={() => setRotate(Math.min(180, Math.max(-180, Number(rotate - 1))))}
                            className='border-2 rounded-md p-1.5 border-accent-hover-color bg-transparent w-10'>-</button>
                        <input type="number" className='bg-transparent w-12' onChange={(e) => rotate >= 0 && setRotate(+e.target.value)} value={rotate} />
                        <button
                            disabled={rotate > 360}
                            onClick={() => setRotate(Math.min(180, Math.max(-180, Number(rotate + 1))))}
                            className='border-2 rounded-md p-1.5 border-accent-hover-color bg-transparent w-10'>+</button>
                    </div>
                </div>
                {
                    crop?.height !== 0 && (
                        <div
                        onClick={onDownloadCropClick}
                        className='flex gap-3 bg-green-primary p-1 px-3 rounded-md items-center'>
                            Save
                            <Icon name='check' />
                        </div>
                    )
                }
            </div>
            {src && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => {
                        setActive(!isActive)
                        setCompletedCrop(c)
                    }}
                    aspect={aspect}
                    onDragStart={() => setActive(true)}
                    minHeight={100}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        className='h-[50vh]'
                        src={src}
                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    />
                </ReactCrop>
            )}
            {!!completedCrop && (
                <div hidden>
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                        }}
                    />
                </div>
            )}
        </div>
    )
}
