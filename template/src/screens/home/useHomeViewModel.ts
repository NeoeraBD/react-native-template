import { useState, useCallback } from "react";
import { PostRepository, Post } from "@app/core";

export const useHomeViewModel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await PostRepository.getPosts(10);
      setPosts(data.slice(0, 10));
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await PostRepository.refreshPosts(10);
      setPosts(data.slice(0, 10));
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to refresh posts");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    posts,
    isLoading,
    isRefreshing,
    errorMessage,
    fetchPosts,
    refreshPosts,
  };
};

export default useHomeViewModel;
