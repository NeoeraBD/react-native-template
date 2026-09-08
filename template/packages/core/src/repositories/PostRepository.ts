import { apiRequest } from '../network/apiRequest';
import { ENDPOINTS } from '../network/endpoints';
import { offlineCache } from '../utils/offlineCache';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const PostRepository = {
  /**
   * Retrieves posts, checking the MMKV offline cache first.
   * If not cached or expired, fetches fresh posts from the API and caches them.
   */
  getPosts: async (ttlMinutes = 10): Promise<Post[]> => {
    return offlineCache.getOrFetch<Post[]>(
      'home_posts',
      async () => {
        return apiRequest<Post[]>({ url: ENDPOINTS.POSTS, method: 'GET' });
      },
      ttlMinutes
    );
  },

  /**
   * Forces a refresh from the API, bypassing cache lookups,
   * updates the local cache, and returns the fresh dataset.
   */
  refreshPosts: async (ttlMinutes = 10): Promise<Post[]> => {
    const data = await apiRequest<Post[]>({ url: ENDPOINTS.POSTS, method: 'GET' });
    offlineCache.set('home_posts', data, ttlMinutes);
    return data;
  },
};

export default PostRepository;
