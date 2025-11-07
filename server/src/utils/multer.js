import multer from "multer";
const upload = multer({ dest: "uploads/" }); // ✅ now req.file.path exists
export default upload;