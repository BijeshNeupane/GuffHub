import toast from "react-hot-toast";
import { useAppSelector } from "../redux/hooks";
import React, { useState, type ChangeEvent } from "react";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const MAX_IMAGES = 2;

const AddPost: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [creating, setCreating] = useState<boolean>(false);

  const { id } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files).slice(
      0,
      MAX_IMAGES - images.length
    );
    const newImages = [...images, ...selected].slice(0, MAX_IMAGES);

    setImages(newImages);

    // Convert to preview URLs
    const newUrls = selected.map((file) => URL.createObjectURL(file));
    const allUrls = [...previews, ...newUrls].slice(0, MAX_IMAGES);
    setPreviews(allUrls);

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];

    URL.revokeObjectURL(updatedPreviews[index]);

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    if (!description.trim()) {
      toast.error("Please provide a description");
      setCreating(false);
      return;
    }

    if (images.length === 0) {
      toast.error("Please select at least one image");
      setCreating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("userId", id!);

      // USE WHAT YOUR BACKEND EXPECTS
      images.forEach((image, idx) => {
        formData.append(`image_${idx + 1}`, image);
      });

      // Debug properly
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data } = await axiosInstance.post("/post/create", formData);

      toast.success("Post created!");
      console.log("SERVER RESPONSE:", data);

      // optional: clear form
      setDescription("");
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setCreating(false);
      setTimeout(() => {
        navigate("/");
      }, 0);
    }
  };

  return (
    <div
      style={{ background: colors.background, color: colors.text }}
      className="min-h-[91vh] flex items-center justify-center py-10 overflow-x-hidden"
    >
      <form
        onSubmit={handleSubmit}
        style={{ backgroundColor: colors.primary }}
        className="w-full max-w-lg shadow-lg p-6 rounded-xl space-y-4 overflow-x-hidden"
      >
        <h2 className="text-xl font-semibold">Create Post</h2>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            style={{
              color: colors.text == "#000000" ? "#ffffff" : "#000000",
            }}
            placeholder="Write a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Images (Max {MAX_IMAGES})
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={images.length >= MAX_IMAGES}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
          />
          <p className="text-xs mt-1">
            {images.length} / {MAX_IMAGES} images selected
          </p>
        </div>

        {/* Preview Section */}
        {previews.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="flex gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 shadow-md"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={creating}
          className="w-full bg-blue-600 text-white py-2.5 rounded hover:-translate-y-1 transition-all duration-300 font-medium active:translate-y-1"
          style={{
            backgroundColor: creating ? "gray" : "#1d4ed8",
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
