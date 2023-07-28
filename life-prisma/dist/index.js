import mongoose from 'mongoose';
import AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import dotenv from 'dotenv';
dotenv.config();
import User from './entities/user.entity';
const PORT = 3000;
AdminJS.registerAdapter(AdminJSMongoose);
const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
};
// ... other imports
// import { Category } from './category.entity.js'
// AdminJS.registerAdapter({
//   // Resource: AdminJSMongoose.Resource,
//   // Database: AdminJSMongoose.Database,
// })
// ... other code
const start = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:039TO8HUz2eVkC6N@life.91cdamb.mongodb.net/life');
    const adminOptions = {
        resources: [User],
    };
    // Please note that some plugins don't need you to create AdminJS instance manually,
    // instead you would just pass `adminOptions` into the plugin directly,
    // an example would be "@adminjs/hapi"
    const admin = new AdminJS(adminOptions);
    // ... other code
};
start();
