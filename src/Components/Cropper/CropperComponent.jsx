import React, {useEffect, useRef, useState} from "react";
// import Cropper from "react-easy-crop";
import "./CropperComponent.scss";
import {fileToBase64} from "../../SM/Utils/Functions";

/**
 * CropperComponent - A React component for image cropping with customizable aspect ratio.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {(string | object)} props.image - The source URL or image object to be cropped (required).
 * @param {Function} props.onCropComplete - Callback function triggered upon cropping completion (required).
 * @param {number} [props.aspectRatio=1] - Desired aspect ratio for the cropping area (default is 1).
 * @param {string} [props.imageSource="link"] - Specifies the type of image source, either "file" or "link" (default is "link").
 * @returns {JSX.Element} - Rendered component.
 *
 * @example
 * // Example usage of CropperComponent
 * const YourComponent = () => {
 *   const handleCropComplete = (croppedArea, croppedAreaPixels) => {
 *     // Custom logic to handle the cropped data
 *     console.log(croppedArea, croppedAreaPixels);
 *   };
 *
 *   return (
 *     <CropperComponent
 *       image={'/path/to/your/image.jpg' || ImageFile}
 *       onCropComplete={handleCropComplete}
 *       aspectRatio={16 / 9}
 *       imageSource="file"
 *     />
 *   );
 * };
 */

const CropperComponent = ({
                              image,
                              setCroppedImage,
                              aspectRatio = 4 / 3,
                              imageSource = "link",
                          }) => {
    const [ImageSrc, SetImageSrc] = useState(image);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [showZoomHint, setShowZoomHint] = useState(false);
    const [showMultiTouchHint, setShowMultiTouchHint] = useState(false);
    const [removeTouchAction, setRemoveTouchAction] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setCroppedImage(croppedAreaPixels);
    };

    const zoomTimeoutRef = useRef();
    const touchTimeoutRef = useRef();
    const cropperRef = useRef(null);

    useEffect(() => {
        clearTimeout(zoomTimeoutRef.current);
        clearTimeout(touchTimeoutRef.current);
    }, []);

    const onWheelRequest = (e) => {
        // require the CTRL/⌘ key to be able to zoom with wheel
        if (e.ctrlKey || e.metaKey) {
            setShowZoomHint(false);
            return true;
        }
        setShowZoomHint(true);
        clearTimeout(zoomTimeoutRef.current);
        zoomTimeoutRef.current = setTimeout(() => setShowZoomHint(false), 2000);
        return false;
    };
    const onTouchRequest = (e) => {
        // require 2 fingers to be able to interact with the image
        if (e.touches.length > 1) {
            setShowMultiTouchHint(false);
            setRemoveTouchAction(true);
            return true;
        }
        setShowMultiTouchHint(true);
        setRemoveTouchAction(false);
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = setTimeout(
            () => setShowMultiTouchHint(false),
            2000
        );
        return false;
    };
    const GetImageString = async () => {
        try {
            let temp = imageSource == "file" ? await fileToBase64(image) : image;
            SetImageSrc(temp);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        GetImageString();
    }, [image]);

    return (
        <div>
            <div className="crop-container">
                {/* <Cropper
          // setImageRef={cropperRef}
          image={ImageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onWheelRequest={onWheelRequest}
          onTouchRequest={onTouchRequest}
          classes={
            removeTouchAction && { containerClassName: "removeTouchAction" }
          }
        /> */}
                {showZoomHint && (
                    <div className="zoom-hint">
                        <p>Use ⌘ + scroll (or ctrl + scroll) to zoom the image</p>
                    </div>
                )}
                {showMultiTouchHint && (
                    <div className="touch-hint">
                        <p>Use 2 fingers to interact with the image</p>
                    </div>
                )}
            </div>
            <div className="controls">
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => {
                        setZoom(e.target.value);
                    }}
                    className="zoom-range"
                />
            </div>
        </div>
    );
};

export default CropperComponent;
