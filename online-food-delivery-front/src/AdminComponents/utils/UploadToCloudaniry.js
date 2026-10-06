const upload_preset = "Code_Cravings";
const cloud_name = "owjiidxf";
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadImageToCloudaniry = async (file) => {
  if (!file) {
    throw new Error("No image selected");
  }

  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", upload_preset);

  const response = await fetch(api_url, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const fileData = await response.json();

  return fileData.secure_url;
};
