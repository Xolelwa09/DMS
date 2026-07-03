const prisma = require("../config/prisma");

exports.getStats = async (req, res) => {
  try {
    const total = await prisma.document.count();

    const pending = await prisma.document.count({
      where: { status: "Pending" },
    });

    const approved = await prisma.document.count({
      where: { status: "Approved" },
    });

    const rejected = await prisma.document.count({
      where: { status: "Rejected" },
    });

    res.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};