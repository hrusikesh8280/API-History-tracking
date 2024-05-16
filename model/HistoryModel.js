const mongoose = require("mongoose");

// const HistorySchema = new Schema({
//   docId: { type: Schema.Types.ObjectId, ref: "ApiDocs", required: true },
//   fieldName: { type: String, required: true },
//   oldValue: { type: Schema.Types.Mixed, required: true },
//   newValue: { type: Schema.Types.Mixed, required: true },
//   updatedAt: { type: Date, default: Date.now },
//   updatedBy: { type: String, required: true },
// });
// const History = mongoose.model("History", HistorySchema);
// module.exports = History;



const ChangeSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed, default: {} },
  newValue: { type: mongoose.Schema.Types.Mixed, required: true },
});

const HistorySchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: "ApiDocs", required: true },
  changes: [ChangeSchema],
  operation: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
});

const History = mongoose.model("History", HistorySchema);
module.exports = History;
