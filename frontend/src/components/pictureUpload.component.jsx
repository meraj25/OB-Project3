import { useState } from "react";
import { useUpdateProfilePictureMutation } from "@/lib/api";

const SIZE_CLASSES = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
};

function ProfilePicture({ user, size = "lg" }) {

    console.log("ProfilePicture render, user:", user);
    const [updateProfilePicture, { isLoading }] = useUpdateProfilePictureMutation();
    const [error, setError] = useState("");

    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");
        try {
            await updateProfilePicture(file).unwrap();
        } catch (err) {
            setError(err?.data?.message ?? "Couldn't upload image.");
        }
    };

    if (user.profile_picture) {
        const src = user.profile_picture.startsWith("http")
        ? user.profile_picture
        : `http://localhost:8000${user.profile_picture}`;
        console.log(src)

        return (
            
            <img
                src={src}
                alt="Profile"
                className={`${sizeClass} rounded-full object-cover`}
            />
        );
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <label className={`${sizeClass} rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground cursor-pointer overflow-hidden`}>
                {isLoading ? "…" : "Upload"}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                />
            </label>
            {error && <p className="text-[10px] text-red-500">{error}</p>}
        </div>
    );
}

export default ProfilePicture;