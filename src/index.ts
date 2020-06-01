export interface NewPost {
  title: string;
  summary?: string;
  content: string;
  tags?: string[];
}

export interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  tags?: Tag[];
  files?: File[];
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

export interface NewQuestion {
  site: string;
  grade: Grade;
  specialty: string;
  subject: string;
  text: string;
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

export interface Response<T> {
  success: boolean;
  status?: number;
  data?: T;
}

export default class ApiClient {
  constructor(private baseUrl: string) {}

  async getPosts(): Promise<Response<Post[]>> {
    return await this.getListResource("posts");
  }

  async createPost({
    title,
    summary,
    content,
    tags,
    files,
  }: Post): Promise<Response<Post>> {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    tags?.forEach((tag) => formData.append("tags", String(tag)));
    files?.forEach((file) => formData.append("files", file));

    let response = await fetch(this.baseUrl + "/api/posts", {
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

  async getPost(id: number): Promise<Response<Post>> {
    return this.getResourceById("posts", id);
  }

  async deletePost(id: number): Promise<Response<never>> {
    return this.deleteResource("posts", id);
  }

  async getTags(): Promise<Response<Tag[]>> {
    return await this.getListResource("tags");
  }

  async createTag(name: string): Promise<Response<Tag>> {
    return await this.createResource("tags", { name });
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

  async createQuestion(question: NewQuestion): Promise<Response<Question>> {
    return this.createResource("questions", question);
  }

  async deleteQuestion(id: number): Promise<Response<never>> {
    return this.deleteResource("questions", id);
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
