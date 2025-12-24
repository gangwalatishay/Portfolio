import axios from "axios";

export default function ImageUpload({ onUpload }) {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );

    onUpload(res.data.secure_url);
  };

  return (
    <div
      className="upload-box"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files[0]);
      }}
    >
      <p>Drag & drop image here</p>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
      />
    </div>
  );
}
