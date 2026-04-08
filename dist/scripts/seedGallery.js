"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gallery_model_1 = require("../models/gallery.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const galleryData = [
    {
        title: 'Office Environment',
        description: 'Our professional office space designed for productivity and collaboration',
        category: 'office',
        src: '/img1.jpeg',
        alt: 'Modern office environment',
        isActive: true
    },
    {
        title: 'Team Meeting',
        description: 'Collaborative team discussions and strategic planning sessions',
        category: 'team',
        src: '/img1.jpeg',
        alt: 'Team meeting in progress',
        isActive: true
    },
    {
        title: 'Client Consultation',
        description: 'Professional client meetings and consultation services',
        category: 'client',
        src: '/img1.jpeg',
        alt: 'Client consultation meeting',
        isActive: true
    },
    {
        title: 'Audit Process',
        description: 'Professional audit services and financial review processes',
        category: 'services',
        src: '/img1.jpeg',
        alt: 'Audit process documentation',
        isActive: true
    },
    {
        title: 'Tax Planning',
        description: 'Strategic tax planning sessions and financial advisory',
        category: 'services',
        src: '/img1.jpeg',
        alt: 'Tax planning consultation',
        isActive: true
    },
    {
        title: 'Office Reception',
        description: 'Welcome area for clients and visitors',
        category: 'office',
        src: '/img1.jpeg',
        alt: 'Office reception area',
        isActive: true
    },
    {
        title: 'Team Collaboration',
        description: 'Working together for excellence and client satisfaction',
        category: 'team',
        src: '/img1.jpeg',
        alt: 'Team collaboration workspace',
        isActive: true
    },
    {
        title: 'Financial Reporting',
        description: 'Comprehensive financial analysis and reporting services',
        category: 'services',
        src: '/img1.jpeg',
        alt: 'Financial reporting session',
        isActive: true
    },
    {
        title: 'Conference Room',
        description: 'Modern meeting facilities for client presentations',
        category: 'office',
        src: '/img1.jpeg',
        alt: 'Conference room setup',
        isActive: true
    },
    {
        title: 'Professional Training',
        description: 'Continuous learning and professional development sessions',
        category: 'team',
        src: '/img1.jpeg',
        alt: 'Professional training session',
        isActive: true
    },
    {
        title: 'Client Success Stories',
        description: 'Celebrating successful client partnerships and achievements',
        category: 'client',
        src: '/img1.jpeg',
        alt: 'Client success celebration',
        isActive: true
    },
    {
        title: 'Digital Solutions',
        description: 'Modern digital tools and technology solutions for accounting',
        category: 'services',
        src: '/img1.jpeg',
        alt: 'Digital accounting solutions',
        isActive: true
    }
];
async function seedGallery() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected to MongoDB');
        // Clear existing gallery data
        await gallery_model_1.Gallery.deleteMany({});
        console.log('Cleared existing gallery data');
        // Insert new gallery data
        const insertedImages = await gallery_model_1.Gallery.insertMany(galleryData);
        console.log(`Successfully inserted ${insertedImages.length} gallery images`);
        // Display inserted data
        console.log('\nInserted Images:');
        insertedImages.forEach((image, index) => {
            console.log(`${index + 1}. ${image.title} (${image.category})`);
        });
        console.log('\n✅ Gallery seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding gallery:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
// Run the seeding function
if (require.main === module) {
    seedGallery();
}
exports.default = seedGallery;
