export interface BaseEntity {
  id: number;
}

export interface Post extends BaseEntity {
  title: string;
  body: string;
  userId: number;
  fileUrl?: string;
  createdAt?: string;
}

export interface LocalPost extends Post {
  createdAt: string;
}

export type CreatePostDto = Omit<Post, 'id'>;
export type UpdatePostDto = Partial<CreatePostDto> & { id: number };

export interface PostCreationResult {
  success: boolean;
  post: LocalPost;
  message?: string;
}
