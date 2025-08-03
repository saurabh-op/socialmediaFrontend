import Navbar from "../Layout/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./edit_profile.css";
import emptyProfilePic from "../../assets/Profile.png";
import imageCompression from "browser-image-compression";
function EditProfile() {
  //related to profile image
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [savedImageUrl, setSavedImageUrl] = useState(null);
  //realted to basic details

  const [user, setUser] = useState({
    profileImageUrl: "",
    name: "",
    username: "",
    bio: "",
    email: "",
    phone: "",
    id: localStorage.getItem("userid"),
  });
  const [alphabetCount, setAlphabetCount] = useState(0);

  const handleBioChange = (e) => {
    const text = e.target.value;

    // Count only alphabetic characters (a-z, A-Z)
    const alphabetsOnly = text.replace(/[^a-zA-Z]/g, "");

    if (alphabetsOnly.length <= 50) {
      setUser((prev) => ({ ...prev, bio: text }));
      setAlphabetCount(alphabetsOnly.length);
    }
  };

  useEffect(() => {
    const alphabetsOnly = user.bio.replace(/[^a-zA-Z]/g, "");
    setAlphabetCount(alphabetsOnly.length);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleImageSubmit = async () => {
    if (selectedImage) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(selectedImage, options);

        uploadProfilePic(compressedFile);
      } catch (error) {
        alert("Something went wrong !");
      }
    } else {
      alert("No image selected");
    }
  };
  const uploadProfilePic = async (imageFile) => {
    try {
      const userId = localStorage.getItem("userid");

      if (!imageFile) {
        alert("Please select an image to upload.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const image = formData.get("image");
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (image && image.size > maxSize) {
        alert("File size limit exceeds 1MB");
      } else {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/editUser/${userId}/uploadProfilePic`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          alert("Uploaded");
        } catch (error) {}
      }

      // Reset states
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(user.phone)) {
      alert("Phone number must be exactly 10 digits.");
      setUploading(false);
      return;
    }
    if (user.username == "" || user.username == null) {
      alert("Username cannot be empty.");
      setUploading(false);
      return;
    }
    setUploading(true);
    try {
      // console.log("User details to be updated:", user);
      const response = await axios.put(
        "http://localhost:8080/api/edituser/editBasicInfo",
        user
      );
      const data = response.data;
      if (data.message === "emailAlreadyExists") {
        alert("Email already exists!");
      }
      if (data.message === "usernameAlreadyExists") {
        alert("Username already taken!");
      }
      if (data.message === "userUpdated") {
        setUser(data.user);
        // console.log("User created:", response.data);
        // console.log(response.data.user);
        alert("Updated successfully");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userid", data.user.id);
        localStorage.setItem("name", data.user.name);
        // localStorage.setItem("password", data.user.password);
        localStorage.setItem("email", data.user.email);
        setUploading(false);
      }
      if (data.message === "userNotFound") {
        //  console.error("Error creating userrrrrr:", error);
        alert("Something went wrong.");
      }
    } catch (error) {
      //  console.error("Error creating user:", error);
      alert("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        // Fetch basic user info
        const userId = localStorage.getItem("userid");

        const userRes = await fetch(
          `http://localhost:8080/api/users/get/${userId}`
        );
        const userData = await userRes.json();
        //   console.log("Fetched user for editing is:", userData);

        if (userData != null) {
          setUser((prevUser) => ({
            ...prevUser,
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            email: userData.email,
            phone: userData.phone,
            profileImageUrl: userData.profileImageUrl || "",
          }));

          if (userData.profileImageUrl) {
            const imageRes = await fetch(
              `http://localhost:8080/api/editUser/${userId}/profilePic`
            );
            if (imageRes.ok) {
              const imageUrl = await imageRes.text();
              setSavedImageUrl(imageUrl);
            }
          }
        }
      } catch (error) {
        //   console.error("unable to edit user", error);
      } finally {
      }
    }

    fetchUserDetails();
  }, []);

  function basicdetails() {
    return (
      <div className="basicdetail_outlinebox">
        <div className="edit_fields">
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="edit_fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="edit_fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="edit_fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>{" "}
        <div className="edit_fields_bio" style={{ position: "relative" }}>
          <textarea
            name="bio"
            placeholder="Bio"
            value={user.bio}
            onChange={handleBioChange}
            rows={4}
            style={{ resize: "none" }}
            required
          />
          <span className="word-count">{alphabetCount}/50</span>
        </div>
        {/* <div className="fields password-field">
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div> */}
        <div>
          <button onClick={handleSubmit} className="edit_actions_save">
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  function profileImage() {
    return (
      <>
        {uploading ? (
          <div className="edit-spinner-overlay">
            <div className="edit_spinner"></div>
          </div>
        ) : (
          <div className="edit_image-container">
            <div className="imagebox">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="edit_imagepreview"
                  />
                </>
              ) : (
                <img
                  src={savedImageUrl ? savedImageUrl : emptyProfilePic}
                  alt="Profile"
                  className="edit_imagepreview"
                />
              )}
            </div>
            <div className="edit_image-actions">
              <div>
                <button
                  type="button"
                  className="edit_Choose"
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  Choose
                </button>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <button className="edit_clear-btn" onClick={handleClear}>
                Clear
              </button>
            </div>
            <button className="edit_upload" onClick={handleImageSubmit}>
              Upload
            </button>{" "}
          </div>
        )}
      </>
    );
  }
  return (
    <div className="editProfilemainpage">
      <div> {profileImage()}</div>
      <div>{basicdetails()}</div>
    </div>
  );
}

export default EditProfile;
