const API_URL = import.meta.env.VITE_API_URL || "";

const getApiOrigin = () => {
    try {
        return API_URL ? new URL(API_URL).origin : "";
    } catch {
        return "";
    }
};

const API_ORIGIN = getApiOrigin();

export const resolveMediaUrl = (url) => {
    if (!url || typeof url !== "string") return "";

    const value = url.trim().replace(/\\/g, "/");
    if (!value) return "";

    if (/^https?:\/\//i.test(value)) {
        if (/^http:\/\/res\.cloudinary\.com\//i.test(value)) {
            return value.replace(/^http:\/\//i, "https://");
        }
        return value;
    }

    if (value.startsWith("//")) {
        return `https:${value}`;
    }

    if (/^res\.cloudinary\.com\//i.test(value)) {
        return `https://${value}`;
    }

    if (value.startsWith("/")) {
        return API_ORIGIN ? `${API_ORIGIN}${value}` : value;
    }

    return API_ORIGIN ? `${API_ORIGIN}/${value}` : value;
};
