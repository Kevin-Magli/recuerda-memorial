export async function convertToWebP(file, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Erro na conversão");
          resolve(blob); // retorna apenas o Blob WebP
        },
        "image/webp",
        quality,
      );
    };

    reader.readAsDataURL(file);
  });
}
