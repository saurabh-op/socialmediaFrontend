import React, { useState } from "react";
import "./ImagePicker.css";
import axios from "axios";
import imageCompression from "browser-image-compression";
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
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(selectedImage, options);

        uploadPost(compressedFile, caption);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Error compressing image, please try again.");
      }
    } else {
      alert("Please select an image and enter a caption.");
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
  };
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
  };

  const uploadPost = async (imageFile, caption) => {
    try {
      const userId = localStorage.getItem("userid");

      if (!imageFile || !caption || !userId) {
        alert("Missing data");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);

      const image = formData.get("image");
      const maxSize = 1 * 1024 * 1024;

      console.log(image.size);
      if (image && image.size > maxSize) {
        alert("File size exceeds the limit (1 MB).");
      } else {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/posts/${userId}/addPost`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
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
      alert("Uploaded Successfully");
    } catch (error) {
      setUploading(false);
      console.error(error);
      alert("Upload failed: " + error.message);
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

                <button className="clear-btn" onClick={handleClear}>
                  Clear
                </button>
              </>
            ) : (
              <label className="Choose">
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
          />{" "}
          <button className="upload" onClick={handleSubmit}>
            Upload
          </button>
        </div>
      )}
    </>
  );
}
