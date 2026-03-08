const API_URL = import.meta.env.VITE_API_URL || "";

const getApiOrigin = () => {
    try {
        return API_URL ? new URL(API_URL).origin : "";
    } catch {
        return "";
    }
};

const API_ORIGIN = getApiOrigin();

export const isPdfAssetUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const value = url.toLowerCase();
    return value.includes(".pdf") || value.includes("/pib-bits/pdfs/");
};

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

export const resolveCoverImageUrl = (url) => {
    const resolved = resolveMediaUrl(url);
    if (!resolved) return "";
    if (isPdfAssetUrl(resolved)) return "";
    if (/^https:\/\/res\.cloudinary\.com\/demo\//i.test(resolved)) return "";
    if (/\/upload\/v1\/cover\.jpg$/i.test(resolved)) return "";

    if (resolved.startsWith("/") || resolved.startsWith("data:") || resolved.startsWith("blob:")) {
        return resolved;
    }

    if (/^https:\/\/res\.cloudinary\.com\//i.test(resolved)) {
        return resolved;
    }

    if (API_ORIGIN && resolved.startsWith(`${API_ORIGIN}/`)) {
        return resolved;
    }

    if (typeof window !== "undefined" && resolved.startsWith(`${window.location.origin}/`)) {
        return resolved;
    }

    return "";
};

export const resolvePdfUrl = (url) => {
    const resolved = resolveMediaUrl(url);
    if (!resolved) return "";

    if (!/res\.cloudinary\.com/i.test(resolved)) {
        return resolved;
    }

    if (!isPdfAssetUrl(resolved)) {
        return resolved;
    }

    return resolved.replace(/\/image\/upload\//i, "/raw/upload/");
};

export const hideBrokenImage = (event) => {
    event.currentTarget.style.display = "none";
};
