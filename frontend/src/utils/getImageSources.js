export const getImageSources = (imageUrl) => {
    const avifUrl = imageUrl.replace(/\.jpg$/, ".avif");
    return { avifUrl, jpgUrl: imageUrl };
};