import multer from "multer";

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, ".public/temp/my-uploads");
  },
  filename: function (request, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.random() * 1e9}`;
    cb(null, `${file.originalname}-${uniqueSuffix}`);
  },
});

const upload = multer({ storage });
