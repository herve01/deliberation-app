import React, { useState } from "react";

export default function AvatarUpload({ nom, prenom }) {
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const getInitials = () => {
    return `${nom?.[0] || ""}${prenom?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="avatar-box">
      {image ? (
        <img src={image} alt="avatar" className="avatar-img" />
      ) : (
        <div className="avatar-placeholder">{getInitials()}</div>
      )}

      <input type="file" onChange={handleImage} />
    </div>
  );
}