const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Query = require('./dist/models/query').default;

const queriesData = [
  {
    constituency: "Delhi North",
    category: "Education",
    priority: "high",
    subject: "School Infrastructure Issues",
    message: "The local school is facing severe infrastructure problems including leaking roofs and broken desks. Students are studying in unsafe conditions.",
    status: "pending"
  },
  {
    constituency: "Mumbai Central",
    category: "Healthcare",
    priority: "urgent",
    subject: "Medical Equipment Shortage",
    message: "The community health center is running low on essential medical supplies and equipment. Patients are being turned away due to lack of resources.",
    status: "in-progress"
  },
  {
    constituency: "Bangalore Rural",
    category: "Agriculture",
    priority: "medium",
    subject: "Irrigation System Problems",
    message: "Farmers in our area are facing water scarcity due to broken irrigation canals. This is affecting crop production significantly.",
    status: "pending"
  },
  {
    constituency: "Chennai South",
    category: "Transportation",
    priority: "high",
    subject: "Road Maintenance Required",
    message: "The main road connecting our village to the city is in terrible condition with potholes everywhere. This is causing accidents and delays.",
    status: "resolved",
    reply: "Road maintenance team has been dispatched. Work will begin next week."
  },
  {
    constituency: "Kolkata West",
    category: "Electricity",
    priority: "urgent",
    subject: "Frequent Power Outages",
    message: "Our area experiences power outages almost daily. This is severely affecting businesses and daily life. Please investigate the issue.",
    status: "pending"
  },
  {
    constituency: "Hyderabad Central",
    category: "Water Supply",
    priority: "high",
    subject: "Contaminated Water Supply",
    message: "The water supplied to our locality has been contaminated. People are falling sick after drinking it. Immediate action required.",
    status: "in-progress",
    reply: "Water quality testing has been initiated. Alternative water supply arrangements are being made."
  },
  {
    constituency: "Pune North",
    category: "Sanitation",
    priority: "medium",
    subject: "Waste Management Issues",
    message: "Garbage collection has been irregular for the past month. Piles of waste are accumulating and causing health hazards.",
    status: "resolved",
    reply: "Waste collection schedule has been normalized. Additional collection points have been added."
  },
  {
    constituency: "Ahmedabad East",
    category: "Law and Order",
    priority: "urgent",
    subject: "Increasing Crime Rate",
    message: "There has been a noticeable increase in petty crimes in our neighborhood. Residents feel unsafe, especially at night.",
    status: "pending"
  },
  {
    constituency: "Jaipur South",
    category: "Employment",
    priority: "medium",
    subject: "Job Training Programs",
    message: "Youth in our area need better access to skill development and job training programs. Current facilities are inadequate.",
    status: "closed",
    reply: "New vocational training center will be established in the next quarter."
  },
  {
    constituency: "Lucknow Central",
    category: "Housing",
    priority: "low",
    subject: "Affordable Housing Initiative",
    message: "Low-income families are struggling to find affordable housing. Is there any government scheme available?",
    status: "resolved",
    reply: "Information about PMAY and other housing schemes has been provided. Local office contact details shared."
  }
];

async function seedQueries() {
  try {
    console.log('🌱 Seeding queries...');

    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL, {
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      waitQueueTimeoutMS: 5000,
    });

    console.log('🔌 Connected to MongoDB');

    // Clear existing queries
    await Query.deleteMany({});
    console.log('🗑️ Cleared existing queries');

    // Create queries with different statuses for testing
    const queriesWithTimestamps = queriesData.map((query, index) => ({
      ...query,
      created_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Spread over last 10 days
    }));

    // Insert queries
    const createdQueries = await Query.insertMany(queriesWithTimestamps);
    console.log(`✅ Successfully seeded ${createdQueries.length} queries`);

    // Log created queries with their status
    createdQueries.forEach((query, index) => {
      console.log(`${index + 1}. ${query.subject} (${query.constituency}) - ${query.category} - Priority: ${query.priority} - Status: ${query.status}`);
    });

    // Summary
    const pending = createdQueries.filter(q => q.status === 'pending').length;
    const inProgress = createdQueries.filter(q => q.status === 'in-progress').length;
    const resolved = createdQueries.filter(q => q.status === 'resolved').length;
    const closed = createdQueries.filter(q => q.status === 'closed').length;

    console.log(`\n📊 Summary:`);
    console.log(`   ⏳ Pending: ${pending}`);
    console.log(`   🔄 In Progress: ${inProgress}`);
    console.log(`   ✅ Resolved: ${resolved}`);
    console.log(`   ❌ Closed: ${closed}`);

    console.log('🎉 Queries seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding queries:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
seedQueries();
