// controllers/auth.controllers.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = process.env;
const { getHTML, sendMail } = require('../libs/nodemailer');

module.exports = {
    register: async (req, res, next) => {
        try {
            let { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'name, email and password are required!',
                    data: null
                });
            }

            let exist = await prisma.user.findFirst({ where: { email } });
            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: 'email has already been used!',
                    data: null
                });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            let userData = {
                name,
                email,
                password: encryptedPassword
            };
            if (role) userData.role = role;
            let user = await prisma.user.create({ data: userData });
            delete user.password;

            // Send welcome email
            await sendMail(user.email, 'Welcome!', 'Welcome to the platform!');

            return res.status(201).json({
                status: true,
                message: 'OK',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            // Login logic
        } catch (error) {
            next(error);
        }
    },

    whoami: async (req, res, next) => {
        try {
            // Who am I logic
        } catch (error) {
            next(error);
        }
    },

    verifyEmail: async (req, res, next) => {
        try {
            // Verify email logic
        } catch (error) {
            next(error);
        }
    },

    requestVerifyEmail: async (req, res, next) => {
        try {
            // Request verify email logic
        } catch (error) {
            next(error);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            // Forgot password logic
        } catch (error) {
            next(error);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const decoded = jwt.verify(token, JWT_SECRET);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: decoded.id },
                data: { password: hashedPassword }
            });

            // Send password changed email
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            await sendMail(user.email, 'Password Changed', 'Your password has been successfully updated.');

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    }
};
