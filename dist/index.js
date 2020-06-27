"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
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
})((Grade = exports.Grade || (exports.Grade = {})));
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  setAuthToken(token) {
    this.token = token;
  }
  authenticate(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      try {
        res = yield fetch(this.baseUrl + "/auth/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
      } catch (_a) {
        return {
          success: false,
          error: {
            type: "Unknown",
            message: "An error occurred while communicating with the server.",
          },
        };
      }
      const body = yield res.json();
      if (res.status !== 200) {
        if (!!body.type) {
          return { success: false, status: res.status, error: body };
        } else {
          return {
            success: false,
            status: res.status,
            error: {
              type: "Unknown",
              message: "An error occurred while trying to log in.",
            },
          };
        }
      } else {
        this.token = body.token;
        return {
          success: true,
          data: body,
        };
      }
    });
  }
  registerUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      try {
        res = yield fetch(this.baseUrl + "/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });
      } catch (_a) {
        return {
          success: false,
          error: {
            type: "Unknown",
            message: "An eerror occurred while communicating with the server.",
          },
        };
      }
      if (res.status !== 200) {
        const body = yield res.json();
        if (!!body.type) {
          return { success: false, status: res.status, error: body };
        } else {
          return {
            success: false,
            status: res.status,
            error: {
              type: "Unknown",
              message: "An error occurred while creating your account.",
            },
          };
        }
      } else {
        return {
          success: true,
        };
      }
    });
  }
  getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch(this.baseUrl + "/api/users/", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (res.status !== 200) {
        return { success: false, status: res.status };
      } else {
        return { success: true, data: yield res.json() };
      }
    });
  }
  getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch(this.baseUrl + "/api/users/" + id, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (res.status !== 200) {
        return { success: false, status: res.status };
      } else {
        return { success: true, data: yield res.json() };
      }
    });
  }
  updateUser(id, model) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch(this.baseUrl + "/api/users/" + id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });
      if (res.status !== 200) {
        return { success: false, status: res.status };
      } else {
        return { success: true, data: yield res.json() };
      }
    });
  }
  deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch(this.baseUrl + "/api/users/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (res.status !== 204) {
        return { success: false, status: res.status };
      } else {
        return { success: true, data: yield res.json() };
      }
    });
  }
  getPosts({ ids, type, tag, page, per_page }) {
    return __awaiter(this, void 0, void 0, function* () {
      let url = "posts?";
      if (ids) {
        url += "&ids=" + ids.join();
      }
      if (type) {
        url += "&type=" + type;
      }
      if (tag) {
        url += "&type=" + tag;
      }
      if (page) {
        url += "&page=" + page;
      }
      if (per_page) {
        url += "&per_page=" + per_page;
      }
      return yield this.getListResource(url);
    });
  }
  createPost(
    { type, title, summary, content, tags, resolves, files, file_names },
    onUploadedFraction
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      let baseUrl = this.baseUrl;
      let formData = new FormData();
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", content);
      if (type) {
        formData.append("type", type);
      }
      tags === null || tags === void 0
        ? void 0
        : tags.forEach((tag) => formData.append("tags", tag));
      file_names === null || file_names === void 0
        ? void 0
        : file_names.forEach((name) => formData.append("names", name));
      files === null || files === void 0
        ? void 0
        : files.forEach((file) => formData.append("files", file));
      resolves === null || resolves === void 0
        ? void 0
        : resolves.forEach((resolved) =>
            formData.append("resolves", resolved.toString())
          );
      return yield new Promise(function (resolve) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.upload.onprogress = (event) => {
          onUploadedFraction && onUploadedFraction(event.loaded / event.total);
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
      return yield this.getResourceById("posts", id);
    });
  }
  deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.deleteResource("posts", id);
    });
  }
  getPostRevisions(id, order = "desc") {
    return __awaiter(this, void 0, void 0, function* () {
      let url = `posts/${id}/revisions?order=${order}`;
      return yield this.getListResource(url);
    });
  }
  createPostRevision(
    id,
    { title, summary, content, tags, resolves, files, file_names },
    onUploadedFraction
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      let baseUrl = this.baseUrl;
      let formData = new FormData();
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", content);
      tags === null || tags === void 0
        ? void 0
        : tags.forEach((tag) => formData.append("tags", tag));
      file_names === null || file_names === void 0
        ? void 0
        : file_names.forEach((name) => formData.append("names", name));
      files === null || files === void 0
        ? void 0
        : files.forEach((file) => formData.append("files", file));
      resolves === null || resolves === void 0
        ? void 0
        : resolves.forEach((resolved) =>
            formData.append("resolves", resolved.toString())
          );
      return yield new Promise(function (resolve) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.upload.onprogress = (event) => {
          onUploadedFraction && onUploadedFraction(event.loaded / event.total);
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
        xhr.open("POST", baseUrl + `/api/posts/${id}/revisions`);
        xhr.send(formData);
      });
    });
  }
  getPostRevision(postId, revisionId) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.getResourceById(
        `posts/${postId}/revisions`,
        revisionId
      );
    });
  }
  deletePostRevision(postId, revisionId) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.deleteResource(`posts/${postId}/revisions`, revisionId);
    });
  }
  searchPosts({ searched, page, results_per_page, type, tag }) {
    return __awaiter(this, void 0, void 0, function* () {
      let url = `search/posts/${searched}?`;
      if (page && results_per_page) {
        url = url + `&page=${page}&results_per_page=${results_per_page}`;
      }
      if (type) {
        url = url + "&type=" + type;
      }
      if (tag !== undefined) {
        url += "&tag=" + tag;
      }
      return yield this.getListResource(url);
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
  deleteTag(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.deleteResource("tags", id);
    });
  }
  renameTag(id, name) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch(this.baseUrl + "/api/tags/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      if (res.status !== 200) {
        return { success: false, status: res.status };
      } else {
        return { success: true, data: yield res.json() };
      }
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
  updateQuestion(id, text) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(this.baseUrl + "/api/questions/" + id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });
      if (response.status !== 200) {
        return { success: false, status: response.status };
      }
      return {
        success: true,
        data: yield response.json(),
      };
    });
  }
  resolveQuestion(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(
        this.baseUrl + "/api/questions/" + id + "/resolve",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        return { success: false, status: response.status };
      }
      return {
        success: true,
        data: yield response.json(),
      };
    });
  }
  registerForNotifications(expo_token) {
    return __awaiter(this, void 0, void 0, function* () {
      const token = encodeURIComponent(expo_token);
      const res = yield fetch(
        this.baseUrl + "/api/notifications/register?token=" + token,
        { method: "POST" }
      );
      if (res.status !== 200) {
        return {
          success: false,
          status: res.status,
        };
      }
      return { success: true };
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
      let response = yield fetch(
        this.baseUrl + "/api/" + uri + "/" + id.toString()
      );
      if (response.status !== 200) {
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
      let response = yield fetch(
        this.baseUrl + "/api/" + uri + "/" + id.toString(),
        {
          method: "DELETE",
        }
      );
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
