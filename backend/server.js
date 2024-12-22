import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import connectDB from './config/db.js';
import typeDefs from './typeDefs/index.js';
import resolvers from './resolvers/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import multer from 'multer';  // Add multer for file handling

dotenv.config();

console.log('Starting server...');
connectDB();

const app = express();

// File upload setup (if needed)
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB limit, adjust as needed
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;
        if (token) {
            try {
                user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            } catch (err) {
                console.error('Token verification failed:', err.message);
            }
        }
        return { user };
    },
});

await server.start();

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));  // Increased limit for body size
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/test', (req, res) => {
    res.send('Test successful');
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.use('/graphql', expressMiddleware(server));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
});
