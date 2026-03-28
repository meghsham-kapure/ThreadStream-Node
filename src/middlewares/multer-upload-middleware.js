import multer from "multer";

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (request, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
