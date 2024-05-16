const History = require("../model/HistoryModel");
const ApiDocs = require("../model/ckdualEditorModel");
const _ = require('lodash');




// const addApi = async (req, res) => {
//   try {
//     const { sections, fields, subsections, } = req.body;
//     if (!sections || !fields) {
//       return res
//         .status(400)
//         .json({ message: " Section and Field are required field " });
//     }
//     const newDoc = new ApiDocs({
//       sections,
//       subsections,
//       fields,
//     });
//     await newDoc.save();
//     res.status(201).json({ message: "succsesfully added", data: newDoc });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


const addApi = async (req, res) => {
  try {
    const { sections, fields, subsections, type, isVisible } = req.body;
    if (!sections || !fields) {
      return res.status(400).json({ message: "Section and Field are required fields" });
    }

    // Add dynamic indexing to fields
    const indexedFields = {};
    let fieldIndex = 1;
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        indexedFields[fieldIndex] = fields[key];
        fieldIndex++;
      }
    }

    // Add dynamic indexing to subsections
    const indexedSubsections = {};
    let subsectionIndex = 1;
    for (const key in subsections) {
      if (subsections.hasOwnProperty(key)) {
        indexedSubsections[subsectionIndex] = subsections[key];
        subsectionIndex++;
      }
    }

    const newDoc = new ApiDocs({
      sections,
      subsections: indexedSubsections,
      fields: indexedFields,
      type,
      isVisible,
    });
    await newDoc.save();

    await History.create({
      docId: newDoc._id,
      changes: [{ fieldName: "all", oldValue: {}, newValue: newDoc }],
      operation: "create",
      updatedBy: req.user._id,
    });

    res.status(201).json({ message: "Successfully added", data: newDoc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const getApiDocs = async (req, res) => {
  try {
    const apiDocs = await ApiDocs.find();
    res.status(200).json({ message: "succsesfully fetched", data: apiDocs });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const updateApiDocs = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Fetch the document
//     const originalDoc = await ApiDocs.findById(id);
//     if (!originalDoc) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     // Calculate changes and prepare the document for update
//     const changes = calculateChanges(originalDoc, req.body, req.user._id);
//     if (changes.length > 0) {
//       // Apply updates and save
//       Object.assign(originalDoc, req.body);
//       await originalDoc.save();

//       // Log changes to the history collection
//       await History.insertMany(changes);

//       res
//         .status(200)
//         .json({ message: "Successfully updated", data: originalDoc, });
//     } else {
//       res.status(200).json({ message: "No changes made", data: originalDoc });
//     }
//   } catch (error) {
//     console.error("Error updating document:", error);
//     res
//       .status(500)
//       .json({ message: "Error updating document", error: error.message });
//   }
// };

const updateApiDocs = async (req, res) => {
  const { id } = req.params;

  try {
    const originalDoc = await ApiDocs.findById(id);
    if (!originalDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const changes = calculateChanges(originalDoc, req.body, req.user._id);
    if (changes.length > 0) {
      const updatedDoc = await ApiDocs.findByIdAndUpdate(id, req.body, { new: true });

      const historyEntry = await History.create({
        docId: updatedDoc._id,
        changes,
        operation: "update",
        updatedBy: req.user._id,
      });

      res.status(200).json({ message: "Successfully updated", data: updatedDoc, changes, historyEntry });
    } else {
      res.status(200).json({ message: "No changes made", data: originalDoc });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document", error: error.message });
  }
};



function calculateChanges(originalDoc, updatedDoc, userId) {
  const originalData = originalDoc.toObject(); 
  const changes = [];

  Object.keys(updatedDoc).forEach((key) => {
    if (!_.isEqual(originalData[key], updatedDoc[key])) {
      changes.push({
        fieldName: key,
        oldValue: originalData[key],
        newValue: updatedDoc[key],
      });
    }
  });

  return changes;
}


const deleteApiDocs = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await ApiDocs.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.deleted = true;
    await doc.save();

    await History.create({
      docId: doc._id,
      changes: [{ fieldName: "deleted", oldValue: false, newValue: true }],
      operation: "delete",
      updatedBy: req.user._id,
    });

    res.status(200).json({ message: "Successfully deleted", data: doc });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
};

module.exports = { addApi, getApiDocs, updateApiDocs, deleteApiDocs };
