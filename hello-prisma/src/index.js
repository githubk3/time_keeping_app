const express = require("express");
const cors = require("cors");

// Using Prisma Client to send queries to your database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

//get list logbook with staff
app.get("/staff/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const logbook = await prisma.staff.findUnique({
      where: {
        staff_id: Number(id),
      },
      include: {
        logbook: true,
      },
    });

    res.json(logbook);
  } catch (error) {
    next(error);
  }
});

app.post("/staff/checkin", async (req, res, next) => {
  try {
    const logbook = await prisma.logbook.create({
      data: {
        checkin: req.body.checkin,
        staff_id: Number(req.body.staff_id),
      },
    });

    res.json(logbook);
  } catch (error) {
    next(error);
  }
});

app.put("/staff/checkout", async (req, res, next) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: {
        staff_id: Number(req.body.staff_id),
      },
      include: {
        logbook: true,
      },
    });

    const length = await staff.logbook.length;
    // console.log(staff.logbook);

    // console.log(length);
    const id = await staff.logbook[length - 1].id;
    console.log(id);

    const logbook = await prisma.logbook.update({
      data: {
        checkout: req.body.checkout,
      },
      where: {
        id: id,
      },
    });

    res.json(logbook);
  } catch (error) {
    next(error);
  }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
