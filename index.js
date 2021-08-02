const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// Set Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "." + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // limit: 10 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("myImage");

// Check File Type
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

// Init app
const app = express();

// EJS
app.set("view engine", "ejs");

// Public Folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.render("index", { msg: err });
    if (req.file == undefined)
      return res.render("index", { msg: "Error: No File Selected!" });
    res.render("index", {
      msg: "File Uploaded!",
      file: `uploads/${req.file.filename}`,
    });
  });
});

app.listen(3000, () => console.log("Started on port 3000..."));
