import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Student from './models/student.model.js';
import Thread from './models/thread.model.js';
import JobPosting from './models/jobPosting.model.js';
import JobApplication from './models/JobApplication.model.js';
import Comment from './models/comment.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string_here';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB...");

    // Clear existing data
    await Promise.all([
        User.deleteMany({}),
        Student.deleteMany({}),
        Thread.deleteMany({}),
        JobPosting.deleteMany({}),
        JobApplication.deleteMany({}),
        Comment.deleteMany({})
    ]);

    const hashedPw = await bcrypt.hash('password123', 10);

    // 1. Create a diverse set of Users
    const users = await User.insertMany([
      { name: "Ananya Iyer", email: "ananya.i23@iitbhilai.ac.in", password: hashedPw, role: "student", isVerified: true },
      { name: "Rohan Verma", email: "rohan.v22@iitbhilai.ac.in", password: hashedPw, role: "student", isVerified: true },
      { name: "Ishita Kaur", email: "ishita.k25@iitbhilai.ac.in", password: hashedPw, role: "student", isVerified: true },
      { name: "Arjun Mehta", email: "arjun.m25@iitbhilai.ac.in", password: hashedPw, role: "student", isVerified: true },
      { name: "Tech Giant HR", email: "hr@google.com", password: hashedPw, role: "recruiter", isVerified: true },
      { name: "Open Source Admin", email: "admin@openlake.in", password: hashedPw, role: "admin", isVerified: true }
    ]);

    const [u1, u2, u3, u4, rec, adm] = users;

    // 2. Create Student Profiles
    await Student.insertMany([
      { user: u1._id, Discipline: "CSE", Program: "B.Tech", CGPA: 9.1, StudentID: "B24CS049", Batch: 2024, Status: "Active" },
      { user: u2._id, Discipline: "DSAI", Program: "B.Tech", CGPA: 8.8, StudentID: "B23AI012", Batch: 2023, Status: "Active" },
      { user: u3._id, Discipline: "EE", Program: "M.Tech", CGPA: 8.2, StudentID: "M22EE005", Batch: 2022, Status: "Active" },
      { user: u4._id, Discipline: "CSE", Program: "B.Tech", CGPA: 9.5, StudentID: "B25CS001", Batch: 2025, Status: "Active" }
    ]);

    // 3. Create Multiple Job Postings
    const jobs = await JobPosting.insertMany([
      {
        jobTitle: "Full Stack Developer",
        jobDescription: "Build scalable web apps using React and Node.js.",
        Company: "Sociofy Tech",
        requiredSkills: ["React", "Express", "MongoDB"],
        Type: "on-campus",
        batch: 2024,
        author: rec.name
      },
      {
        jobTitle: "Data Scientist",
        jobDescription: "Analyze large datasets and build ML models.",
        Company: "DataInsight",
        requiredSkills: ["Python", "PyTorch", "SQL"],
        Type: "off-campus",
        batch: 2023,
        author: rec.name
      },
      {
        jobTitle: "DevOps Intern",
        jobDescription: "Manage cloud infrastructure and CI/CD pipelines.",
        Company: "CloudScale",
        requiredSkills: ["Docker", "Kubernetes", "AWS"],
        Type: "on-campus",
        batch: 2025,
        author: adm.name
      }
    ]);

    // 4. Create Community Threads
    const t1 = await Thread.create({
      author: u1._id,
      title: "Best resources for learning Docker?",
      text: "I'm starting with containerization. Any suggestions for labs or tutorials?",
      upvotes: [u2._id, u3._id]
    });

    const t2 = await Thread.create({
      author: u2._id,
      title: "Internship season prep",
      text: "Is it better to focus on LeetCode or building projects?",
      upvotes: [u1._id]
    });

    // 5. Add Comments to Threads
    const c1 = await Comment.create({
      threadId: t1._id,
      author: adm._id,
      text: "Check out the official Docker documentation and Katacoda labs!"
    });
    t1.comments.push(c1._id);
    await t1.save();

    // 6. Create Random Job Applications
    await JobApplication.insertMany([
      { studentId: u1._id, jobId: jobs[0]._id, status: "applied" },
      { studentId: u2._id, jobId: jobs[1]._id, status: "in-review" },
      { studentId: u1._id, jobId: jobs[1]._id, status: "applied" }
    ]);

    console.log("Database Seeded with multiple entries! 🚀");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();