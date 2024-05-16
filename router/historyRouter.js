const express = require("express");
const{getAllHistory, getHistoryByDocId} = require("../controller/HistoryController")

const HistoryRouter = express.Router();

// HistoryRouter.get("/:id", getH);
HistoryRouter.get("/history",getAllHistory)
HistoryRouter.get("/history/:docId",getHistoryByDocId)

module.exports = { HistoryRouter };
