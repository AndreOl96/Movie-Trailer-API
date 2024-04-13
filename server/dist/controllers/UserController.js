import { validationResult } from "express-validator";
import fileService from "../utils/FileService.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModel.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const usersPath = "./src/data/users.json";
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async getUserById(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async registerUser(req, res) {
        var _a, _b;
        try {
            const { name, email, password, role } = req.body;
            const foundUser = await UserModel.findOne({ email });
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            if (foundUser) {
                return res.status(400).json({ error: 'User already exists.' });
            }
            let avatar = "default.png";
            if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar) {
                avatar = fileService.save((_b = req.files) === null || _b === void 0 ? void 0 : _b.avatar);
            }
            const newUser = new UserModel({
                name,
                email,
                password: bcrypt.hashSync(password.trim(), 7),
                avatar,
                role
            });
            await newUser.save();
            const payload = {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            };
            const token = jwt.sign(payload, String(SECRET_KEY));
            newUser.password = "";
            return res.status(201).json({ user: newUser, accessToken: token });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    async loginUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const foundUser = await UserModel.findOne({ email });
            if (!foundUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                return res.status(400).json({ error: 'Invalid password.' });
            }
            const payload = {
                id: foundUser._id,
                email: foundUser.email,
                name: foundUser.name,
                role: foundUser.role
            };
            foundUser.password = "";
            const token = jwt.sign(payload, String(SECRET_KEY));
            return res.json({ user: foundUser, accessToken: token });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    async updateUser(req, res) {
        var _a, _b;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { name, email, password, role } = req.body;
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            let avatar = user.avatar;
            if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar) {
                if (user.avatar && user.avatar !== 'default.png') {
                    fileService.delete(user.avatar);
                }
                avatar = fileService.save((_b = req.files) === null || _b === void 0 ? void 0 : _b.avatar);
            }
            user.name = name;
            user.email = email;
            user.password = bcrypt.hashSync(password.trim(), 7);
            user.avatar = avatar;
            user.role = role;
            await user.save();
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await UserModel.findByIdAndDelete(userId);
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            if (deletedUser.avatar !== "default.png") {
                fileService.delete(deletedUser.avatar);
            }
            return res.json({ message: "User deleted successfully!" });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async searchUsers(req, res) {
        try {
            const { query, page = 1, limit = 10 } = req.query;
            const regex = new RegExp(query, 'i');
            const users = await UserModel
                .find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { role: regex }
                ]
            })
                .skip((page - 1) * limit)
                .limit(limit);
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
}
export default new UserController;
//# sourceMappingURL=UserController.js.map