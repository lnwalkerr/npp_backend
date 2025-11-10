"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepository = createRepository;
exports.getAllRepositories = getAllRepositories;
exports.getRepositoryById = getRepositoryById;
exports.updateRepository = updateRepository;
const fileUpload_1 = require("../utils/fileUpload");
const image_1 = require("../models/image");
const utils_1 = require("../utils/utils");
function createRepository(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title } = req.body;
            const mode = process.env.STORAGE_MODE || "local";
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required",
                });
            }
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one image file is required",
                });
            }
            const images = [];
            for (const file of req.files) {
                const { url } = yield (0, fileUpload_1.fileUpload)(file, mode);
                images.push({ url }); // ✅ store object instead of string
            }
            const newImage = new image_1.default({
                title,
                images,
                created_at: utils_1.Utils.indianTimeZone(),
            });
            yield newImage.save();
            res.status(201).json({
                success: true,
                message: "Repository created successfully",
                data: newImage,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function getAllRepositories(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repositories = yield image_1.default.find();
            // Add imageCount field to each repository
            const data = repositories.map((repo) => (Object.assign(Object.assign({}, repo.toObject()), { imageCount: Array.isArray(repo.images) ? repo.images.length : 0 })));
            res.status(200).json({
                success: true,
                message: "Repositories fetched successfully",
                count: data.length, // total repositories
                data, // includes imageCount for each
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function getRepositoryById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({
                    message: "Repository ID is required",
                });
            }
            const repository = yield image_1.default.findById(id);
            if (!repository) {
                return res.status(404).json({
                    message: "Repository not found",
                });
            }
            res.status(200).json({
                message: "Repository fetched successfully",
                data: repository,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function updateRepository(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, title, deleteImageIds } = req.body;
            const mode = process.env.STORAGE_MODE || "local";
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Repository ID is required",
                });
            }
            const repository = yield image_1.default.findById(id);
            if (!repository) {
                return res.status(404).json({
                    success: false,
                    message: "Repository not found",
                });
            }
            // ✅ Update title if provided
            if (title)
                repository.title = title;
            // ✅ Handle image deletions
            if (deleteImageIds && deleteImageIds.length > 0) {
                for (const imageId of deleteImageIds) {
                    const imageToDelete = repository.images.id(imageId);
                    if (imageToDelete) {
                        // Delete the file (local or S3)
                        yield (0, fileUpload_1.deleteFile)(imageToDelete.url, mode);
                        // Remove image from array
                        imageToDelete.deleteOne();
                    }
                }
            }
            // ✅ Handle new uploads (if any)
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const { url } = yield (0, fileUpload_1.fileUpload)(file, mode);
                    repository.images.push({ url });
                }
            }
            repository.updated_at = utils_1.Utils.indianTimeZone();
            yield repository.save();
            res.status(200).json({
                success: true,
                message: "Repository updated successfully",
                data: repository,
            });
        }
        catch (error) {
            console.error("Error in updateRepository:", error);
            next(error);
        }
    });
}
//# sourceMappingURL=imageController.js.map