export interface NewPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  is_guideline?: boolean;
  superseding?: number;
  tags?: Tag[];
  files?: File[];
  names?: string[];
  onUploadedFraction?: Function;
}

export interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  is_guideline: boolean;
  superseding: number;
  superseded_by: number;
  created_at: string;
  tags: Tag[];
  files: File[];
}

export interface Search {
  searched: string;
  page?: number;
  results_per_page?: number;
  guidelines_only?: boolean;
  include_old?: boolean;
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

export interface Token {
  id: number;
  token: string;
  role: "normal" | "admin";
  expires: number;
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

export default class ApiClient {
  constructor(public baseUrl: string) {}

  async authenticate(
    email: string,
    password: string
  ): Promise<Response<Token>> {
    let res;
    try {
      res = await fetch("/auth/authenticate", {
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

  addAttributes(tag?: number, include_old?: boolean): string {
    let url = "";
    if (tag !== undefined) {
      url = url + `tag=${tag}`;
    }
    if (include_old === true) {
      url = url + "&include_old=true";
    }
    return url;
  }

  async getPosts(
    tag?: number,
    include_old?: boolean
  ): Promise<Response<Post[]>> {
    let url = "posts?" + this.addAttributes(tag, include_old);
    return await this.getListResource(url);
  }

  async getGuidelines(
    tag?: number,
    include_old?: boolean
  ): Promise<Response<Post[]>> {
    let url =
      "posts?guidelines_only=true&" + this.addAttributes(tag, include_old);
    return await this.getListResource(url);
  }

  async getGuidelineRevisions(
    id: number,
    reverse?: boolean
  ): Promise<Response<Post[]>> {
    let url = `guidelines/${id}`;
    if (reverse === true) {
      url = url + "?reverse=true";
    }
    return await this.getListResource(url);
  }

  async createPost({
    title,
    summary,
    content,
    is_guideline,
    superseding,
    tags,
    names,
    files,
    onUploadedFraction,
  }: NewPost): Promise<Response<Post>> {
    let baseUrl = this.baseUrl;
    let formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (is_guideline === true) {
      formData.append("is_guideline", "true");
    }
    if (superseding !== undefined) {
      formData.append("superseding", String(superseding));
    }
    tags?.forEach((tag) => formData.append("tags", String(tag)));
    names?.forEach((name) => formData.append("names", name));
    files?.forEach((file) => formData.append("files", file));

    return await new Promise(function (resolve, reject) {
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
  }

  async getPost(id: number): Promise<Response<Post>> {
    return this.getResourceById("posts", id);
  }

  async deletePost(id: number): Promise<Response<never>> {
    return this.deleteResource("posts", id);
  }

  async deleteGuidelineRevisions(id: number): Promise<Response<never>> {
    return this.deleteResource("guidelines", id);
  }

  async searchPosts({
    searched,
    page,
    results_per_page,
    guidelines_only,
    include_old,
    tag,
  }: Search): Promise<Response<Post[]>> {
    let url = `search/posts/${searched}?`;
    if (page !== undefined && results_per_page !== undefined) {
      url = url + `page=${page}&results_per_page=${results_per_page}`;
    }
    if (guidelines_only === true) {
      url = url + "&guidelines_only=true";
    }
    if (include_old === true) {
      url = url + "&include_old=true";
    }
    if (tag !== undefined) {
      url = url + `&tag=${tag}`;
    }
    return this.getListResource(url);
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

  async createFile(
    file: File,
    name: string,
    post: number
  ): Promise<Response<FileEntity>> {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("post", String(post));

    let response = await fetch(this.baseUrl + "/api/files", {
      method: "POST",
      body: formData,
    });

    if (response.status != 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
  }

  async deleteFile(id: number): Promise<Response<undefined>> {
    let response = await fetch(this.baseUrl + "/api/files/" + id.toString(), {
      method: "DELETE",
    });

    if (response.status != 204) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
    };
  }

  async getFile(id: number): Promise<Response<FileEntity>> {
    const response = await fetch(this.baseUrl + "/api/files/" + id.toString());

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
