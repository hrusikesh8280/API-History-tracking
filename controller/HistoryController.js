const History = require("../model/HistoryModel");

// const getHistory = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const historyRecords = await History.find({ docId: id }).sort({
//       updatedAt: -1,
//     });
//     res.status(200).json({
//       message: "History records retrieved successfully",
//       data: historyRecords,
//     });
//   } catch (error) {
//     console.error("Error retrieving history records:", error);
//     res.status(500).json({
//       message: "Failed to retrieve history records",
//       error: error.message,
//     });
//   }
// };


const getAllHistory = async (req, res) => {
  try {
    const historyRecords = await History.find().sort({ updatedAt: -1 });
    res.status(200).json({
      message: "All history records retrieved successfully",
      data: historyRecords,
    });
  } catch (error) {
    console.error("Error retrieving history records:", error);
    res.status(500).json({
      message: "Failed to retrieve history records",
      error: error.message,
    });
  }
};



const getHistoryByDocId = async (req, res) => {
  const { docId } = req.params;

  console.log(`Fetching history for docId: ${docId}`);

  try {
    const historyRecords = await History.find({ docId: docId }).sort({ updatedAt: -1 });

    console.log(`History records found: ${historyRecords.length}`);

    res.status(200).json({
      message: "History records retrieved successfully",
      data: historyRecords,
    });
  } catch (error) {
    console.error("Error retrieving history records:", error);
    res.status(500).json({
      message: "Failed to retrieve history records",
      error: error.message,
    });
  }
};

module.exports = { getHistoryByDocId };


module.exports = { getHistoryByDocId };

module.exports = {getAllHistory,getHistoryByDocId };

