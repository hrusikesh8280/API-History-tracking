const express = require("express");

const {
  addApi,
  getApiDocs,
  updateApiDocs,
  deleteApiDocs,
} = require("../controller/ckeditorController");
const router = express.Router();

router.post("/addApi", addApi);
router.get("/getApi", getApiDocs);
router.patch("/update/:id", updateApiDocs);
router.delete("/delete/:id", deleteApiDocs);
module.exports = router;
