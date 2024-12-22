import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema({
    // Applicant's details
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    skills: [{ type: String, required: true }], // Array of skills
    currentJobTitle: { type: String, default: "" },
    expectedSalary: { type: Number, required: true },
    description: { type: String, required: true }, // Message to recruiter

    // Job details
    companyName: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobPostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recruiter

    // User who applied
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User

    // Application metadata
    status: {
        type: String,
        enum: ["pending", "shortlisted", "rejected"],
        default: "pending",
    },
    appliedTime: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
