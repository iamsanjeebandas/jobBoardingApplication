const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        username: String!
        firstName: String!
        lastName: String!
        phone: String
        role: String!
        company: String
        profilePicture: String
        isActive: Boolean!
    }

    type Job {
        id: ID!
        title: String!
        description: String!
        jobRole: String!
        company: String!
        postedBy: String!
        postedAt: String!
    }

    type Company {
        id: ID!
        name: String!
        description: String
    }

   input ApplyInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    yearsOfExperience: Int!
    skills: [String!]!
    currentJobTitle: String
    expectedSalary: Float!
    description: String!
    appliedBy: String!
}

type Application {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    yearsOfExperience: Int!
    skills: [String!]!
    currentJobTitle: String
    expectedSalary: Float!
    description: String!
    companyName: String!
    jobId: Job!
    jobPostedBy: User!
    appliedTime: String!
    status: String!
    appliedBy: User!
}

    type Query {
        users: [User]
        jobs: [Job]
        user(id: ID!): User
        companies: [Company]
        applications: [Application]
        getUser(id: ID!): User   
        postedJobs(userId: String!): [Job]  # New query to fetch jobs posted by a specific user
        userApplications(userId: ID!): [Application]
        applicationsByRecruiter(recruiterId: ID!): [Application!]!
        findUser(id: ID!): User
        getAllSeekers: [User!]!
        getAllRecruiters: [User!]!
    }

   type Mutation {
    register(
        email: String!, 
        username: String!, 
        firstName: String!, 
        lastName: String!, 
        password: String!, 
        role: String!, 
        company: String
    ): User

    login(email: String!, password: String!): String!

    postJob(
        title: String!, 
        description: String!, 
        jobRole: String!,
        company: String!, 
        postedBy: String!
    ): Job

    applyToJob(jobId: ID!, input: ApplyInput!): Application

    updateApplicationStatus(applicationId: ID!, status: String!, recruiterId: ID): Application

        updateProfilePicture(id: ID!, profilePicture: String!): User
    
          updateRecruiterProfile(
        id: ID!, 
        firstName: String, 
        lastName: String, 
        email: String, 
        username: String
    ): User

        toggleUserActiveStatus(userId: ID!): User!
          deleteJob(id: ID!): Job
          removeProfilePicture(id: ID!): User

}

`;


export default typeDefs;