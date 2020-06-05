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
exports.Grade = void 0;
var Grade;
(function (Grade) {
    Grade["Consultant"] = "consultant";
    Grade["SpR"] = "spr";
    Grade["CoreTrainee"] = "core_trainee";
    Grade["FY2"] = "fy2";
    Grade["FY1"] = "fy1";
    Grade["FiY1"] = "fiy1";
})(Grade = exports.Grade || (exports.Grade = {}));
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getListResource("posts");
        });
    }
    createPost({ title, summary, content, tags, names, files, onUploadedFraction, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let baseUrl = this.baseUrl;
            let formData = new FormData();
            formData.append("title", title);
            formData.append("summary", summary);
            formData.append("content", content);
            tags === null || tags === void 0 ? void 0 : tags.forEach((tag) => formData.append("tags", String(tag)));
            names === null || names === void 0 ? void 0 : names.forEach((name) => formData.append("names", name));
            files === null || files === void 0 ? void 0 : files.forEach((file) => formData.append("files", file));
            return yield new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.upload.onprogress = (event) => {
                    if (onUploadedFraction !== undefined) {
                        onUploadedFraction(event.loaded / event.total);
                    }
                };
                xhr.upload.onerror = () => {
                    resolve({ success: false, status: -1 });
                };
                xhr.upload.onabort = () => {
                    resolve({ success: false, status: -2 });
                };
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status != 200) {
                            resolve({ success: false, status: xhr.status });
                        }
                        resolve({ success: true, data: xhr.response });
                    }
                };
                xhr.open("POST", baseUrl + "/api/posts");
                xhr.send(formData);
            });
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getResourceById("posts", id);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteResource("posts", id);
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getListResource("tags");
        });
    }
    createTag(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createResource("tags", { name });
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
    getSites() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getListResource("sites");
        });
    }
    createSite(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createResource("sites", { name });
        });
    }
    deleteSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteResource("sites", id);
        });
    }
    getQuestionSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getListResource("questions/subjects");
        });
    }
    createQuestionSubject(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createResource("questions/subjects", { name });
        });
    }
    deleteQuestionSubject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteResource("questions/subjects", id);
        });
    }
    getQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getListResource("questions");
        });
    }
    getQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getResourceById("questions", id);
        });
    }
    createQuestions(question) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createResource("questions", question);
        });
    }
    deleteQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteResource("questions", id);
        });
    }
    getPostStats(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getResource(`posts/${id}/stats`);
        });
    }
    updatePostStats(id, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateResource(`posts/${id}/stats`, stats);
        });
    }
    getListResource(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/" + uri);
            if (response.status !== 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    createResource(uri, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/" + uri, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(model),
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
    getResourceById(uri, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getResource(uri + "/" + id.toString());
        });
    }
    getResource(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/" + uri);
            if (response.status !== 200) {
                return { success: false, status: response.status };
            }
            return {
                success: true,
                data: yield response.json(),
            };
        });
    }
    updateResource(uri, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl + "/api/" + uri, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(model),
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
    deleteResource(uri, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(this.baseUrl + "/api/" + uri + "/" + id.toString(), {
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
}
exports.default = ApiClient;
