import { create } from "zustand";
import blogService from "./services/blogs";

const useNotificationStore = create((set) => ({
  notification: "",
  actions: {
    setNotification: (notification) => set(() => ({ notification })),
  },
}));

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs }));
    },
    create: async (newBlog, user) => {
      const blog = await blogService.create(newBlog);
      set((state) => ({
        blogs: state.blogs.concat({
          ...blog,
          user: { name: user.name, username: user.username, id: blog.user },
        }),
      }));
    },
    like: async (blog) => {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        user: blog.user.id,
        likes: ++blog.likes,
      });

      set((state) => ({
        blogs: state.blogs.map((blog) => {
          if (blog.id === updatedBlog.id) {
            return {
              ...updatedBlog,
              user: blog.user,
            };
          }

          return blog;
        }),
      }));
    },
    remove: async (blogId) => {
      await blogService.remove(blogId);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== blogId),
      }));
    },
  },
}));

const useUserStore = create((set) => ({
  user: {},
  actions: {
    setUser: (user) => set(() => ({ user })),
    isLoggedIn: () => Object.entries(useUserStore.getState().user).length !== 0,
  },
}));

export const useLoggedUser = () => useUserStore((state) => state.user);

export const useLoggedUserActions = () =>
  useUserStore((state) => state.actions);

export const useBlogs = () => {
  const blogs = useBlogStore((state) => state.blogs);

  return blogs.toSorted((a, b) => b.likes - a.likes);
};

export const useBlogActions = () => useBlogStore((state) => state.actions);

export const useNotification = () =>
  useNotificationStore((state) => state.notification);

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
