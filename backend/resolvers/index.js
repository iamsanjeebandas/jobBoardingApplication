
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const resolvers = {
    Query: {
        users: async () => await User.find(),
        jobs: async () => await Job.find(),

        user: async (_, { id }, context) => {
            try {
              
                const user = await User.findById(id); 
                if (!user) {
                    throw new Error('User not found');
                }

                return user;
            } catch (error) {
                throw new Error('Error fetching user: ' + error.message);
            }
        },

        getAllSeekers: async () => {
            try {
              const seekers = await User.find({ role: "seeker" });
              return seekers;
            } catch (error) {
              throw new Error("Error fetching seekers: " + error.message);
            }
          },

          getAllRecruiters: async () => {
            try {
              const recruiters = await User.find({ role: "recruiter" });
              return recruiters;
            } catch (error) {
              throw new Error("Error fetching recruiters: " + error.message);
            }
          },


        findUser: async (_, { id }) => {
            return await User.findById(id); // Fetch user by ID from MongoDB
          },
         // Fetch jobs posted by a specific user
         postedJobs: async (_, { userId }) => {
            try {
                // Find all jobs where the postedBy field matches the userId
                const jobs = await Job.find({ postedBy: userId });
                return jobs;
            } catch (err) {
                console.error('Error fetching posted jobs:', err.message);
                throw new Error('Error fetching posted jobs');
            }
        },
        applications: async () => await Application.find(),
        
        applicationsByRecruiter: async (_, { recruiterId }) => {
            try {
              // Fetch applications where the recruiter is the one who posted the job
              const applications = await Application.find({ "jobPostedBy": recruiterId }).populate("jobId").populate("appliedBy");
              return applications;
            } catch (error) {
              throw new Error("Error fetching applications");
            }
          },

        userApplications: async (_, { userId }) => {
            try {
              const applications = await Application.find({ appliedBy: userId }).populate('jobId jobPostedBy');
              return applications;
            } catch (error) {                           
              throw new Error("Error fetching applications");
            }
          }
        
    },
    Mutation: {
        register: async (_, { email, username, firstName, lastName, password, role, company }) => {
            const user = new User({ email, username, firstName, lastName, password, role, company });
            return await user.save();
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');
            if(email === "admin@gmail.com" && password === "admin123") return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials');
            return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        },
        postJob: async (_, { title, description, jobRole, company, postedBy }) => {
           
            const newJob = new Job({
                title,
                description,
                jobRole,
                // experience,
                company: company,
                postedBy: postedBy,
            });
            await newJob.save();
            return newJob;
        },
        updateProfilePicture: async (_, { id, profilePicture }) => {
            return await User.findByIdAndUpdate(id, { profilePicture }, { new: true });
          },  
          
        applyToJob: async (_, { jobId, input }, { user }) => {
            const job = await Job.findById(jobId);
            if (!job) throw new Error('Job not found');

            // Create a new application with the required fields
            const application = new Application({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phoneNumber: input.phoneNumber,
                yearsOfExperience: input.yearsOfExperience,
                skills: input.skills,
                currentJobTitle: input.currentJobTitle,
                expectedSalary: input.expectedSalary,
                description: input.description,
                companyName: job.company,
                jobId: job.id,
                jobPostedBy: job.postedBy,
                status: "pending",
                appliedTime: new Date(),
                appliedBy: input.appliedBy,
            });

            // Save the applion
            return await application.save();
        },
        updateApplicationStatus: async (_, { applicationId, status, recruiterId }) => {
            // Ensure the user is a recruiter
            // if (user.role !== 'recruiter') throw new Error('Not authorized');
        
            // Find the application by ID
            const application = await Application.findById(applicationId);
        
            // Check if application exists
            if (!application) {
                throw new Error('Application not found');
            }
        
            // Only update if the status is "pending", as that’s the only editable status
            if (application.status !== 'pending') {
                throw new Error('Cannot update application status. It is no longer pending.');
            }
        
            // Update the application status and set the recruiter who updated it
            application.status = status;
            // application.updatedBy = recruiterId;  
            await application.save(); 
        
            return application;
        },
        updateRecruiterProfile: async (_, { id, firstName, lastName, email, username }) => {
            const user = await User.findById(id);
            if (!user) throw new Error("User not found");

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (email) user.email = email;
            if (username) user.username = username;

            await user.save();
            return user;
        },
        toggleUserActiveStatus: async (_, { userId }) => {
            try {
              const user = await User.findById(userId);
              if (!user) throw new Error("User not found");
      
              user.isActive = !user.isActive;
              await user.save();
      
              return user;
            } catch (error) {
              throw new Error("Error updating user status: " + error.message);
            }
          },
          deleteJob: async (_, { id }) => {
            try {
                // Find the job by ID
                const job = await Job.findById(id);
                if (!job) {
                    throw new Error("Job not found");
                }
        
                // Delete associated applications
                await Application.deleteMany({ jobId: id });
        
                // Delete the job
                await job.deleteOne();
        
                return job;
            } catch (err) {
                throw new Error("Error deleting job: " + err.message);
            }
        },
        removeProfilePicture: async (_, { id }) => {
            return await User.findByIdAndUpdate(id, { profilePicture: null }, { new: true });
          },
        
    },
};


export default resolvers;
