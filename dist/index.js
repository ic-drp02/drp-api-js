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
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/posts");
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    createPost({ title, summary, content, tags, files, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            formData.append("title", title);
            if (summary) {
                formData.append("summary", summary);
            }
            formData.append("content", content);
            tags === null || tags === void 0 ? void 0 : tags.forEach((tag) => formData.append("tags", String(tag)));
            files === null || files === void 0 ? void 0 : files.forEach((file) => formData.append("files", file));
            let response = yield fetch(this.baseUrl + "/api/posts", {
                method: "POST",
                body: formData,
            });
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/posts/" + id.toString());
            return yield response.json();
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/posts/" + id.toString(), {
                method: "DELETE",
            });
            if (response.status != 204) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
            };
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/tags");
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    createTag(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/tags", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            });
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/files");
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    createFile(file, name, post) {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);
            formData.append("post", String(post));
            let response = yield fetch(this.baseUrl + "/api/files", {
                method: "POST",
                body: formData,
            });
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    deleteFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/files/" + id.toString(), {
                method: "DELETE",
            });
            if (response.status != 204) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
            };
        });
    }
    getFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/files/" + id.toString());
            if (response.status != 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
}
exports.default = ApiClient;
