
import React, { useRef, useState } from "react";

interface ImageUploadProps {
    initialImage?: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ImageUpload({
    initialImage,
    onChange
}: ImageUploadProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
        onChange(e)
    };

    const inputRef = useRef<HTMLInputElement | null>(null)
    return (
        <div className="relative group">
            <div
                className="w-40 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                style={{
                    backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                onClick={() => inputRef.current?.click()}
            >
                {!imagePreview && (
                    <span className="text-gray-500 group-hover:text-gray-700">
                        Click to upload
                    </span>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                    ref={inputRef}
                />
            </div>
        </div>
    );
}