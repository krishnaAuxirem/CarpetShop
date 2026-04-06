import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlogPost } from "@/types";
import { BLOG_POSTS } from "@/constants/data";

interface BlogStore {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id">) => void;
  updatePost: (id: string, data: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPublished: () => BlogPost[];
  getBySlug: (slug: string) => BlogPost | undefined;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      posts: [...BLOG_POSTS],

      addPost: (post) => {
        const newPost: BlogPost = { ...post, id: `b_${Date.now()}` };
        set(state => ({ posts: [newPost, ...state.posts] }));
      },

      updatePost: (id, data) => {
        set(state => ({
          posts: state.posts.map(p => p.id === id ? { ...p, ...data } : p),
        }));
      },

      deletePost: (id) => {
        set(state => ({ posts: state.posts.filter(p => p.id !== id) }));
      },

      getPublished: () => get().posts.filter(p => p.isPublished),
      getBySlug: (slug) => get().posts.find(p => p.slug === slug),
    }),
    { name: "carpet-blog" }
  )
);
