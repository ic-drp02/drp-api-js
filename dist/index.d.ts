declare type PostType = "update" | "guideline";
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
  questions: {
    subject: string;
    text: string;
  }[];
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
export declare enum Grade {
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
export declare type UserRole = "user" | "admin";
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
  baseUrl: string;
  private token?;
  constructor(baseUrl: string);
  setAuthToken(token?: string): void;
  authenticate(email: string, password: string): Promise<Response<Token>>;
  registerUser(email: string, password: string): Promise<Response<never>>;
  getUsers(): Promise<Response<User[]>>;
  getUser(id: number): Promise<Response<User>>;
  updateUser(
    id: number,
    model: {
      password?: string;
      role?: UserRole;
    }
  ): Promise<Response<User>>;
  deleteUser(id: number): Promise<Response<User>>;
  getPosts({
    ids,
    type,
    tag,
    page,
    per_page,
  }: PostsQuery): Promise<Response<Post[]>>;
  createPost(
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
  ): Promise<Response<Post>>;
  getPost(id: number): Promise<Response<Post>>;
  deletePost(id: number): Promise<Response<never>>;
  getPostRevisions(
    id: number,
    order?: "asc" | "desc"
  ): Promise<Response<PostRevision[]>>;
  createPostRevision(
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
  ): Promise<Response<Post>>;
  getPostRevision(
    postId: number,
    revisionId: number
  ): Promise<Response<PostRevision>>;
  deletePostRevision(
    postId: number,
    revisionId: number
  ): Promise<Response<never>>;
  searchPosts({
    searched,
    page,
    results_per_page,
    type,
    tag,
  }: SearchQuery): Promise<Response<Post[]>>;
  getTags(): Promise<Response<Tag[]>>;
  createTag(name: string): Promise<Response<Tag>>;
  deleteTag(id: number): Promise<Response<never>>;
  renameTag(id: number, name: string): Promise<Response<Tag>>;
  getFiles(): Promise<Response<FileEntity[]>>;
  getSites(): Promise<Response<Site[]>>;
  createSite(name: string): Promise<Response<Site>>;
  deleteSite(id: number): Promise<Response<never>>;
  getQuestionSubjects(): Promise<Response<Subject[]>>;
  createQuestionSubject(name: string): Promise<Response<Subject>>;
  deleteQuestionSubject(id: number): Promise<Response<never>>;
  getQuestions(): Promise<Response<Question[]>>;
  getQuestion(id: number): Promise<Response<Question>>;
  createQuestions(question: NewQuestion): Promise<Response<Question>>;
  deleteQuestion(id: number): Promise<Response<never>>;
  updateQuestion(id: number, text: string): Promise<Response<Question>>;
  resolveQuestion(id: number): Promise<Response<Question>>;
  registerForNotifications(expo_token: string): Promise<Response<never>>;
  private getListResource;
  private createResource;
  private getResourceById;
  private deleteResource;
}
export {};
