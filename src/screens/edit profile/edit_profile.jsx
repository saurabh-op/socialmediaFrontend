import Navbar from "../Layout/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./edit_profile.css";
import "./layout_editProfile.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import emptyProfilePic from "../../assets/Profile.png";
import imageCompression from "browser-image-compression";
import { Trash2, ImagePlus, CloudCheck } from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
function EditProfile() {
  const navigate = useNavigate();
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
        toast.warning("Something went wrong !", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.error("No new image selected", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  const uploadProfilePic = async (imageFile) => {
    try {
      const userId = localStorage.getItem("userid");

      if (!imageFile) {
        toast.error("Please select an image to upload", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const image = formData.get("image");
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (image && image.size > maxSize) {
        toast.error("File size exceeded", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/editUser/${userId}/uploadProfilePic`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );

          toast.success("Successfully Updated", {
            autoClose: 2000,
          });
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
      toast.warning("Phone number should be of 10 digits", {
        autoClose: 3000,
      });
      setUploading(false);
      return;
    }
    if (user.username == "" || user.username == null) {
      toast.warning("Username cannot be empty", {
        autoClose: 3000,
      });
      setUploading(false);
      return;
    }
    setUploading(true);
    try {
      // console.log("User details to be updated:", user);
      const response = await axios.put(
        "${API_BASE_URL}/edituser/editBasicInfo",
        user,
      );
      const data = response.data;
      if (data.message === "emailAlreadyExists") {
        toast.error("Email already exists!");
      }
      if (data.message === "usernameAlreadyExists") {
        toast.error("Username already taken!");
      }
      if (data.message === "userUpdated") {
        setUser(data.user);
        // console.log("User created:", response.data);
        // console.log(response.data.user);
        toast.success("Successfully Updated");
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
        toast.error("Something went wrong.");
      }
    } catch (error) {
      //  console.error("Error creating user:", error);
      toast.error("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        // Fetch basic user info
        const userId = localStorage.getItem("userid");

        const userRes = await fetch(`${API_BASE_URL}/users/get/${userId}`);
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
              `${API_BASE_URL}/editUser/${userId}/profilePic`,
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
        <div className="form-grid">
          <div className="edit_fields">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
            />
          </div>

          <div className="edit_fields">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="@username"
              value={user.username}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="edit_fields">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <div className="edit_fields">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={user.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="edit_fields_bio">
          <label>Bio</label>

          <textarea
            name="bio"
            placeholder="Tell people about yourself..."
            value={user.bio}
            onChange={handleBioChange}
            rows={4}
          />

          <span className="word-count">{alphabetCount}/50</span>
        </div>

        <button onClick={handleSubmit} className="edit_actions_save">
          {uploading ? "Saving..." : "Save Changes"}
        </button>
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
            <div className="img_button_container">
              <button
                type="button"
                className="edit_action_button"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <ImagePlus size={18} />
                Select image
              </button>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <button className="edit_action_button" onClick={handleClear}>
                <Trash2 size={18} />
                Remove image
              </button>

              <button
                className="edit_action_button"
                onClick={handleImageSubmit}
              >
                <CloudCheck size={18} />
                Save image
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <div className="editprofile_bg">
      <Navbar />

      <div className="editprofile_container">
        <div
          className="back_button"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <FiArrowLeft size={22} />
        </div>

        <div className="instructions">Edit Profile Image</div>
        <div> {profileImage()}</div>
        <div className="instructions">Edit Personal Details</div>
        <div>{basicdetails()}</div>
      </div>
    </div>
  );
}

export default EditProfile;
