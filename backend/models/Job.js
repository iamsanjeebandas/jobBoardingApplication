import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    jobRole: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    postedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', JobSchema);
export default Job;
