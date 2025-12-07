export const compressFile = (file, maxSizeMB = 1) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Keep original width & height
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        let quality = 0.9;

        const compressLoop = () => {
          canvas.toBlob(
            (blob) => {
              // Convert to MB
              const sizeMB = blob.size / 1024 / 1024;

              if (sizeMB <= maxSizeMB || quality <= 0.2) {
                resolve(blob);
              } else {
                quality -= 0.1;
                compressLoop();
              }
            },
            "image/jpeg",
            quality
          );
        };

        compressLoop();
      };

      img.src = event.target.result;
    };

    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
};
