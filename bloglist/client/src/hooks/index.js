import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useContext, useState } from "react";
import NotificationContext from "../NotificationContext";

export const useBlogs = () => {
  const queryClient = useQueryClient();
  const { notificate } = useContext(NotificationContext);

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchInterval: 500,
    refetchOnWindowFocus: false,
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      notificate("Blog has been added", 5000);
    },
    onError: (error) => {
      notificate(error.response.data.error, 5000);
    },
  });

  const newCommentMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => {
          if (blog.id === newBlog.blogId) {
            const comment = {
              id: newBlog.id,
              comment: newBlog.comment,
            };

            return {
              ...blog,
              comments: blog.comments.concat(comment),
            };
          }

          return blog;
        }),
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (blogId) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => blog.id !== blogId),
      );
    },
    onError: (error) => {
      console.error(error.response);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => {
          if (blog.id === newBlog.id) {
            return newBlog;
          }

          return blog;
        }),
      );
    },
    onError: (error) => {
      console.error(error.response);
    },
  });

  return {
    blogs: result.data,
    isPending: result.isPending,
    create: (newBlog) => newBlogMutation.mutate(newBlog),
    addComment: (id, comment) => newCommentMutation.mutate({ id, comment }),
    remove: (id) => deleteBlogMutation.mutate(id),
    likeBlog: (id, updatedBlog) =>
      updateBlogMutation.mutate({
        id,
        updatedBlog: { ...updatedBlog, likes: updatedBlog.likes + 1 },
      }),
  };
};

export const useField = (label, type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return { label, type, value, onChange };
};
