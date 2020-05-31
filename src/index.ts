export interface Post {
  id: number;
  title: string;
  summary?: string;
  content: string;
  tags?: Tag[];
}

export interface Tag {
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
  }: Post): Promise<Response<Post>> {
    let response = await fetch(this.baseUrl + "/api/posts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        summary,
        content,
        tags,
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
}
