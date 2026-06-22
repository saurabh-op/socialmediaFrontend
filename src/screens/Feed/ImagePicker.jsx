import React, { useState } from "react";
import "./ImagePicker.css";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import {
  ArrowBigUp,
  BalloonIcon,
  Check,
  CloudBackup,
  CloudCheck,
  ImagePlus,
  Save,
  Trash,
} from "lucide-react";
export default function ImagePicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (selectedImage && caption) {
      try {
        // ✅ Step 1: Crop the image to 4:5
        const croppedBlob = await cropImageToAspectRatio(selectedImage, 4 / 5);

        // ✅ Step 2: Compress
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(croppedBlob, options);

        // ✅ Step 3: Upload
        uploadPost(compressedFile, caption);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Error compressing image, please try again.");
      }
    } else {
      toast.warning("Please select an image and enter a caption.");
    }
  };

  const cropImageToAspectRatio = (file, aspectRatio) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Calculate crop dimensions
        const inputWidth = img.width;
        const inputHeight = img.height;
        let cropWidth = inputWidth;
        let cropHeight = inputWidth / aspectRatio;

        if (cropHeight > inputHeight) {
          cropHeight = inputHeight;
          cropWidth = cropHeight * aspectRatio;
        }

        const x = (inputWidth - cropWidth) / 2;
        const y = (inputHeight - cropHeight) / 2;

        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          x,
          y,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight,
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, file.type);
      };

      img.onerror = (err) => reject(err);
    });
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
  };

  const uploadPost = async (imageFile, caption) => {
    try {
      const userId = localStorage.getItem("userid");
      const username = localStorage.getItem("username");
      const name = localStorage.getItem("name");

      if (!imageFile || !caption || !userId) {
        toast.error("Missing data");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("username", username);
      formData.append("name", name);

      const image = formData.get("image");
      const maxSize = 1 * 1024 * 1024;

      console.log(image.size);
      if (image && image.size > maxSize) {
        toast.error("File size exceeded");
      } else {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/posts/${userId}/addPost`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
      }
      console.log("here");
      setUploading(false);
      setPreviewUrl();
      setSelectedImage();
      setCaption();
      toast.success("Uploaded Successfully");
    } catch (error) {
      setUploading(false);
      console.error(error);
      toast.error("Upload failed");
    }
  };

  return (
    <>
      {uploading ? (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="image-picker-container">
          <div className="image-box">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="preview-img" />
              </>
            ) : (
              <label className="Choose">
                <ImagePlus size={20} />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            )}
          </div>
          <textarea
            placeholder="Enter caption..."
            className="caption-textarea"
            value={caption}
            onChange={handleCaptionChange}
            rows={1}
          />
          <div className="actionButtonsimgpicker">
            <button className="clear-btn" onClick={handleClear}>
              <Trash fill={"red"} size={20} strokeWidth={1} /> Discard Image
            </button>
            <button className="saveImage" onClick={handleSubmit}>
              <ArrowBigUp fill={"green"} size={20} strokeWidth={1} /> Post
            </button>
          </div>
        </div>
      )}
    </>
  );
}
