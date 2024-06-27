import multer from "multer";
import path from "path";
import fs from "fs";

const configureMulter = (destinationPath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(destinationPath);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  return multer({ storage });
};

export default configureMulter;
