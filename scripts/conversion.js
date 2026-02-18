export function convertToWebP(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Redimensiona (exemplo max 800px largura)
        const maxWidth = 800;
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Converte para WebP com qualidade 0.7
        const webp = canvas.toDataURL("image/webp", 0.7);

        resolve(webp);
      };
    };

    reader.readAsDataURL(file);
  });
}
