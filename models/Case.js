const mongoose = require("mongoose");

const CasesSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, default: "pending" },
    amount: { type: Number, required: true },
    number_payments: { type: Number, required: true },
    code: String,
    installment: { type: Array, required: true },
    time: { type: String, required: true },
    verifided_date: Date,
    applied_date: Date,
    reviewed: Boolean,
    image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Cases", CasesSchema);
