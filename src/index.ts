type PostType = "update" | "guideline";

export interface NewPostRevision {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  resolves: number[];
  files?: File[];
  file_names?: string[];
}

export interface NewPost extends NewPostRevision {
  type?: PostType;
}

export interface Post {
  id: number;
  type: PostType;
  latest_revision: PostRevision;
}

export interface PostRevision {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
  tags: Tag[];
  files: FileEntity[];
}

export interface SearchQuery {
  searched: string;
  page?: number;
  results_per_page?: number;
  type?: "any" | PostType;
  tag?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface FileEntity {
  id: number;
  name: string;
  post: number;
}

export interface FileWithPost {
  file: FileEntity;
  post: Post;
}

export interface NewQuestion {
  site: string;
  grade: Grade;
  specialty: string;
  questions: { subject: string; text: string }[];
}

export interface Question {
  id: number;
  site: Site;
  grade: Grade;
  specialty: string;
  subject: Subject;
  text: string;
  resolved_by: Post;
}

export interface Site {
  id: number;
  name: string;
}

export enum Grade {
  Consultant = "consultant",
  SpR = "spr",
  CoreTrainee = "core_trainee",
  FY2 = "fy2",
  FY1 = "fy1",
  FiY1 = "fiy1",
}

export interface Subject {
  id: number;
  name: string;
}

export type UserRole = "user" | "admin";

export interface Token {
  id: number;
  token: string;
  role: UserRole;
  expires: number;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  confirmed: boolean;
}

export interface Error {
  type?: string;
  message?: string;
}

export interface Response<T, E = Error> {
  success: boolean;
  status?: number;
  data?: T;
  error?: E;
}

export interface PostsQuery {
  ids?: number[];
  type?: PostType | "any";
  tag?: string;
  page?: number;
  per_page?: number;
}

export default class ApiClient {
  private token?: string;

  constructor(public baseUrl: string) {}

  setAuthToken(token?: string) {
    this.token = token;
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<Response<Token>> {
    let res;
    try {
      res = await fetch(this.baseUrl + "/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch {
      return {
        success: false,
        error: {
          type: "Unknown",
          message: "An error occurred while communicating with the server.",
        },
      };
    }

    const body = await res.json();

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
  }

  async registerUser(
    email: string,
    password: string
  ): Promise<Response<never>> {
    let res;
    try {
      res = await fetch(this.baseUrl + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch {
      return {
        success: false,
        error: {
          type: "Unknown",
          message: "An eerror occurred while communicating with the server.",
        },
      };
    }

    if (res.status !== 200) {
      const body = await res.json();
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
  }

  async getUsers(): Promise<Response<User[]>> {
    const res = await fetch(this.baseUrl + "/api/users/", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (res.status !== 200) {
      return { success: false, status: res.status };
    } else {
      return { success: true, data: await res.json() };
    }
  }

  async getUser(id: number): Promise<Response<User>> {
    const res = await fetch(this.baseUrl + "/api/users/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (res.status !== 200) {
      return { success: false, status: res.status };
    } else {
      return { success: true, data: await res.json() };
    }
  }

  async updateUser(
    id: number,
    model: { password?: string; role?: UserRole }
  ): Promise<Response<User>> {
    const res = await fetch(this.baseUrl + "/api/users/" + id, {
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
      return { success: true, data: await res.json() };
    }
  }

  async deleteUser(id: number): Promise<Response<User>> {
    const res = await fetch(this.baseUrl + "/api/users/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (res.status !== 204) {
      return { success: false, status: res.status };
    } else {
      return { success: true, data: await res.json() };
    }
  }

  async getPosts({
    ids,
    type,
    tag,
    page,
    per_page,
  }: PostsQuery): Promise<Response<Post[]>> {
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

    return await this.getListResource(url);
  }

  async createPost(
    {
      type,
      title,
      summary,
      content,
      tags,
      resolves,
      files,
      file_names,
    }: NewPost,
    onUploadedFraction?: (progress: number) => any
  ): Promise<Response<Post>> {
    let baseUrl = this.baseUrl;
    let formData = new FormData();

    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);

    if (type) {
      formData.append("type", type);
    }

    tags?.forEach((tag) => formData.append("tags", tag));
    file_names?.forEach((name) => formData.append("names", name));
    files?.forEach((file) => formData.append("files", file));

    resolves?.forEach((resolved) =>
      formData.append("resolves", resolved.toString())
    );

    return await new Promise(function (resolve) {
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
  }

  async getPost(id: number): Promise<Response<Post>> {
    return await this.getResourceById("posts", id);
  }

  async deletePost(id: number): Promise<Response<never>> {
    return await this.deleteResource("posts", id);
  }

  async getPostRevisions(
    id: number,
    order: "asc" | "desc" = "desc"
  ): Promise<Response<PostRevision[]>> {
    let url = `posts/${id}/revisions?order=${order}`;
    return await this.getListResource(url);
  }

  async createPostRevision(
    id: number,
    {
      title,
      summary,
      content,
      tags,
      resolves,
      files,
      file_names,
    }: NewPostRevision,
    onUploadedFraction?: (progress: number) => any
  ): Promise<Response<Post>> {
    let baseUrl = this.baseUrl;
    let formData = new FormData();

    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);

    tags?.forEach((tag) => formData.append("tags", tag));
    file_names?.forEach((name) => formData.append("names", name));
    files?.forEach((file) => formData.append("files", file));

    resolves?.forEach((resolved) =>
      formData.append("resolves", resolved.toString())
    );

    return await new Promise(function (resolve) {
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
  }

  async getPostRevision(
    postId: number,
    revisionId: number
  ): Promise<Response<PostRevision>> {
    return await this.getResourceById(`posts/${postId}/revisions`, revisionId);
  }

  async deletePostRevision(
    postId: number,
    revisionId: number
  ): Promise<Response<never>> {
    return await this.deleteResource(`posts/${postId}/revisions`, revisionId);
  }

  async searchPosts({
    searched,
    page,
    results_per_page,
    type,
    tag,
  }: SearchQuery): Promise<Response<Post[]>> {
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

    return await this.getListResource(url);
  }

  async getTags(): Promise<Response<Tag[]>> {
    return await this.getListResource("tags");
  }

  async createTag(name: string): Promise<Response<Tag>> {
    return await this.createResource("tags", { name });
  }

  async deleteTag(id: number): Promise<Response<never>> {
    return await this.deleteResource("tags", id);
  }

  async renameTag(id: number, name: string): Promise<Response<Tag>> {
    const res = await fetch(this.baseUrl + "/api/tags/" + id, {
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
      return { success: true, data: await res.json() };
    }
  }

  async getFiles(): Promise<Response<FileEntity[]>> {
    const response = await fetch(this.baseUrl + "/api/files");

    if (response.status != 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
  }

  async getSites(): Promise<Response<Site[]>> {
    return this.getListResource("sites");
  }

  async createSite(name: string): Promise<Response<Site>> {
    return this.createResource("sites", { name });
  }

  async deleteSite(id: number): Promise<Response<never>> {
    return this.deleteResource("sites", id);
  }

  async getQuestionSubjects(): Promise<Response<Subject[]>> {
    return await this.getListResource("questions/subjects");
  }

  async createQuestionSubject(name: string): Promise<Response<Subject>> {
    return this.createResource("questions/subjects", { name });
  }

  async deleteQuestionSubject(id: number): Promise<Response<never>> {
    return this.deleteResource("questions/subjects", id);
  }

  async getQuestions(): Promise<Response<Question[]>> {
    return await this.getListResource("questions");
  }

  async getQuestion(id: number): Promise<Response<Question>> {
    return await this.getResourceById("questions", id);
  }

  async createQuestions(question: NewQuestion): Promise<Response<Question>> {
    return this.createResource("questions", question);
  }

  async deleteQuestion(id: number): Promise<Response<never>> {
    return this.deleteResource("questions", id);
  }

  async updateQuestion(id: number, text: string): Promise<Response<Question>> {
    const response = await fetch(this.baseUrl + "/api/questions/" + id, {
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
      data: await response.json(),
    };
  }

  async resolveQuestion(id: number): Promise<Response<Question>> {
    const response = await fetch(
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
      data: await response.json(),
    };
  }

  async registerForNotifications(expo_token: string): Promise<Response<never>> {
    const token = encodeURIComponent(expo_token);
    const res = await fetch(
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
  }

  private async getListResource<T>(uri: string): Promise<Response<T[]>> {
    const response = await fetch(this.baseUrl + "/api/" + uri);

    if (response.status !== 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
  }

  private async createResource<T, U>(
    uri: string,
    model: U
  ): Promise<Response<T>> {
    const response = await fetch(this.baseUrl + "/api/" + uri, {
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
      data: await response.json(),
    };
  }

  private async getResourceById<T>(
    uri: string,
    id: number
  ): Promise<Response<T>> {
    let response = await fetch(
      this.baseUrl + "/api/" + uri + "/" + id.toString()
    );

    if (response.status !== 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
  }

  private async deleteResource(
    uri: string,
    id: number
  ): Promise<Response<never>> {
    let response = await fetch(
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
  }
}
