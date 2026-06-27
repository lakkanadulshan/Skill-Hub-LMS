import React, { useState, useEffect } from "react";
import { API } from "../services/api";


export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  }, []);

  const handleChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = JSON.parse(localStorage.getItem("user")).token;

    const res = await API.put("/users/profile-picture", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const updated = { ...user, avatar: res.data.avatar };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setPreview(null);
    alert("Updated!");
  };

  if (!user) return null;

  return (
    <div className="p-10">

      {/* AVATAR */}
      <div className="relative w-36 h-36 mx-auto">

        <label htmlFor="img" className="cursor-pointer">
          <img
            src={preview || user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`}
            className="w-36 h-36 rounded-full object-cover border-4"
          />
        </label>

        <input
          id="img"
          type="file"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* UPLOAD BUTTON */}
      {file && (
        <button
          onClick={upload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Photo
        </button>
      )}

    </div>
  );
}