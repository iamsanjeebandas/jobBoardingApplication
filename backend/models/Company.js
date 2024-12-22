import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;
