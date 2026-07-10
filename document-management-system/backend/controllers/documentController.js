const prisma = require("../config/prisma");
const { extractText } = require("../services/ocrService");
const {
         extractInvoiceData,
       } = require("../services/extractionService");

exports.uploadDocument = async (req, res) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }

    const { documentType } = req.body;
    const ocrText = await extractText(req.file.path);

     console.log("===== OCR TEXT =====");
     console.log(ocrText);
     console.log("====================");

     const extractedData = extractInvoiceData(ocrText);


      console.log("===== EXTRACTED DATA =====");
      console.log(extractedData);
      console.log("==========================");
      console.log("===== EXTRACTED DATA =====");
console.log(JSON.stringify(extractedData, null, 2));
console.log("==========================");

     console.log("Checking for duplicate invoice...");

let existingInvoice = null;

// Check invoice number only if it exists
if (extractedData.invoiceNumber) {
  existingInvoice = await prisma.document.findFirst({
    where: {
      invoiceNumber: extractedData.invoiceNumber,
    },
  });
}

// Check vendor + amount only if both exist
if (
  !existingInvoice &&
  extractedData.vendor &&
  extractedData.amount
) {
  existingInvoice = await prisma.document.findFirst({
    where: {
      vendor: extractedData.vendor,
      amount: extractedData.amount,
    },
  });
}

console.log("Duplicate search result:");
console.log(existingInvoice);

      if (existingInvoice) {
  console.log("Duplicate invoice detected!");

  return res.status(409).json({
    message: "Duplicate invoice detected.",
    duplicate: existingInvoice,
  });
       }

    console.log("No duplicate found. Saving document...");

    const document = await prisma.document.create({
  data: {
    documentType,
    fileName: req.file.filename,
    filePath: req.file.path,
    uploadedById: req.user.id,

    status: "Pending Stage 1",

    vendor: extractedData.vendor,
    invoiceNumber: extractedData.invoiceNumber,
    amount: extractedData.amount,
    vat: extractedData.vat,
  },
});

    res.status(201).json({
      message: "Document uploaded",
      document,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const userRole = req.user.role?.toLowerCase();

    let newStatus = document.status;

    // Reject from any stage
    if (status === "Rejected") {
      newStatus = "Rejected";
    }

    // Reviewer approves Stage 1
    else if (
      status === "Approved" &&
      document.status === "Pending Stage 1"
    ) {
      if (userRole !== "reviewer") {
        return res.status(403).json({
          message: "Only Reviewers can approve Stage 1",
        });
      }

      newStatus = "Pending Stage 2";
    }

    // Manager approves Stage 2
    else if (
      status === "Approved" &&
      document.status === "Pending Stage 2"
    ) {
      if (userRole !== "manager") {
        return res.status(403).json({
          message: "Only Managers can approve Stage 2",
        });
      }

      newStatus = "Pending Stage 3";
    }

    // Finance/Admin approves Stage 3
    else if (
      status === "Approved" &&
      document.status === "Pending Stage 3"
    ) {
      if (
        userRole !== "finance" &&
        userRole !== "admin"
      ) {
        return res.status(403).json({
          message: "Only Finance/Admin can approve Stage 3",
        });
      }

      newStatus = "Approved";
    }

    else {
      return res.status(400).json({
        message: "Invalid workflow transition",
      });
    }

    const updatedDocument = await prisma.document.update({
      where: {
        id: Number(id),
      },
      data: {
        status: newStatus,
      },
    });

    res.json({
      message: "Document status updated.",
      document: updatedDocument,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update document status.",
    });
  }
};
    

exports.getDocuments = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase();
    const userId = req.user.id;
    console.log("ROLE FROM TOKEN:", req.user.role);

    let documents;

    // User sees only their own documents
    if (role === "user") {
      documents = await prisma.document.findMany({
        where: {
          uploadedById: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Reviewer sees only Stage 1 documents
    else if (role === "reviewer") {
  documents = await prisma.document.findMany({
    where: {
      status: "Pending Stage 1",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("Reviewer sees:", documents.length);
}

    // Manager sees only Stage 2 documents
    else if (role === "manager") {
      documents = await prisma.document.findMany({
        where: {
          status: "Pending Stage 2",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Finance sees only Stage 3 documents
    else if (role === "finance") {
      documents = await prisma.document.findMany({
        where: {
          status: "Pending Stage 3",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Admin sees everything
    else if (role === "admin") {
      documents = await prisma.document.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    else {
      documents = [];
    }

    res.json(documents);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};
exports.getStats = async (req, res) => {
  try {
    const total = await prisma.document.count();

    const approved = await prisma.document.count({
      where: {
        status: "Approved",
      },
    });

    const rejected = await prisma.document.count({
      where: {
        status: "Rejected",
      },
    });

    const pending = await prisma.document.count({
      where: {
        status: {
          startsWith: "Pending",
        },
      },
    });

    res.json({
      total,
      approved,
      rejected,
      pending,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
};