const express = require("express");
const router = express.Router();
const s3 = require("../aws/s3");
const config = require("config");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const Cases = require("../models/Case");

const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");

const { DLBUCKETNAME, BUCKETNAME } = config.get("AWS");

router.post("/image", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  if (file) {
    const uploadParams = {
      Bucket: config.get("AWS.BUCKETNAME"),
      Key: file.originalname,
      Body: file.buffer,
      ContentEncoding: file.encoding,
      ContentType: file.mimetype,
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data);
    });

    res.send("GG");
  } else {
    res.send("get good");
  }
});

router.post("/", async (req, res) => {
  try {
    const { installment } = req.body;
    if (!installment) {
      res.status(500).json({ msg: "installment no valid" });
    }
    const newCases = new Cases(req.body);
    const response = await newCases.save();

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
});

router.get("/image/:imageId", (req, res) => {
  try {
    console.log("executed");
    const { imageId } = req.params;
    let params = {
      Bucket: config.get("AWS.BUCKETNAME"),
      Key: imageId,
    };

    console.log(params);

    s3.getObject(params, (err, data) => {
      if (err) {
        res.status(500).send({
          error: "Internal Server Error",
          errName: err.name,
          errMessage: err.message,
          errDescription: err.description,
        });
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.write(data.Body, "binary");
        res.end(null, "binary");
      }
    });

    // res.writeHead(200, {
    //   "Content-Type": "application/png",
    //   "Content-Disposition": `attachment; filename=${imageId}`,
    // });
    // s3.getObject(params)
    //   .createReadStream()
    //   .on("error", function (err) {
    //     res.status(500).json({ error: "Error -> " + err });
    //   })
    //   .pipe(res);

    // req.setTimeout(60000, function () {
    //   // if after 60s file not downlaoded, we abort a request
    //   req.abort();
    // });

    // res.send(imageId);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/sockettest", async (req, res) => {
  try {
    const io = req.app.get("socketio");
    io.emit("test", {
      msg: "klk",
    });
    res.send("received");
  } catch (error) {
    console.log(error);
  }
});

router.post("/data", async (req, res) => {
  const { startDate, endDate } = req.body;
  const response = await Cases.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  res.status(201).json(response);
});

router.post("/previousCases", async (req, res) => {
  const { status1, status2 } = req.body;
  const response = await Cases.find({
    status: { $in: [status1, status2] },
    createdAt: {
      $lt: startOfDay(new Date()),
    },
  });
  res.status(201).json(response);
});

router.get("/", async (req, res) => {
  const response = await Cases.find({
    createdAt: {
      $gte: startOfDay(new Date()),
      $lte: endOfDay(new Date()),
    },
  });
  res.status(201).json(response);
});

router.get("/", async (req, res) => {
  // if (!startDate || !endDate) {
  //   const response = await Cases.find({});
  //   res.status(201).json(response);
  // }

  const response = await Cases.find({});
  res.status(201).json(response);
});

router.get("/:CaseId", async (req, res) => {
  const { CaseId } = req.params;
  const response = await Cases.findById(CaseId);
  res.json(response);
});

// router.get('/:status', async (req, res) => {
//   // const endDate = set(new Date(), { hours: 0, minutes: 0 }) || new Date();
//   // const { status } = req.params;
//   // console.log('klk', status);
//   if (req.params) {
//     const response = await Cases.find({
//       createdAt: {
//         $lt: startOfDay(new Date()),
//       },
//       status: 'pending',
//     });
//     res.send(response);
//   }
// });

router.put("/:CaseId", async (req, res) => {
  const { CaseId } = req.params;
  const response = await Cases.findByIdAndUpdate(CaseId, req.body, {
    new: true,
  });
  res.json(response);
});

router.delete("/:CaseId", async (req, res) => {
  try {
    const { CaseId } = req.params;
    await Cases.findByIdAndDelete(CaseId);
    res.send("Deleted");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
