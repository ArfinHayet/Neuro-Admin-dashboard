export const compressFile = (file, maxSizeMB = 1) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let quality = 0.9;

        const mimeType = file.type; // image/png | image/jpeg
        const extension = file.name.split(".").pop(); // png / jpg

        const compressLoop = () => {
          canvas.toBlob(
            (blob) => {
              const sizeMB = blob.size / 1024 / 1024;

              if (sizeMB <= maxSizeMB || quality <= 0.2) {
                // convert Blob → File
                const compressedFile = new File(
                  [blob],
                  file.name, // keep original name with extension
                  { type: mimeType }
                );

                resolve(compressedFile);
              } else {
                quality -= 0.1;
                compressLoop();
              }
            },
            mimeType, // 🔑 keep original format
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
