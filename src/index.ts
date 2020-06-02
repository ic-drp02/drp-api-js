export interface Post {
  id: number;
  title: string;
  summary?: string;
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

export interface Response<T> {
  success: boolean;
  status?: number;
  data?: T;
}

export default class ApiClient {
  constructor(private baseUrl: string) {}

  async getPosts(): Promise<Response<Post[]>> {
    let response = await fetch(this.baseUrl + "/api/posts");

    if (response.status != 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
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
    if (summary) {
      formData.append("summary", summary);
    }
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
    let response = await fetch(this.baseUrl + "/api/posts/" + id.toString());
    return await response.json();
  }

  async deletePost(id: number): Promise<Response<undefined>> {
    let response = await fetch(this.baseUrl + "/api/posts/" + id.toString(), {
      method: "DELETE",
    });

    if (response.status != 204) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
    };
  }

  async getTags(): Promise<Response<Tag[]>> {
    const response = await fetch(this.baseUrl + "/api/tags");

    if (response.status != 200) {
      return { success: false, status: response.status };
    }

    return {
      success: true,
      data: await response.json(),
    };
  }

  async createTag(name: string): Promise<Response<Tag>> {
    const response = await fetch(this.baseUrl + "/api/tags", {
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
      data: await response.json(),
    };
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
}
