import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ListRenderItem } from 'react-native';
import { useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useHomeViewModel } from './useHomeViewModel';
import { Post } from '@app/core';
import { CustomCard, CustomSearchbar, CustomFlatList } from '@app/ui';

export const PostsTab = observer(() => {
  const theme = useTheme();
  const viewModel = useHomeViewModel();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    viewModel.fetchPosts();
  }, [viewModel.fetchPosts]);

  const filteredPosts = viewModel.posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderPostItem = useCallback<ListRenderItem<Post>>(({ item }) => (
    <CustomCard
      title={item.title}
      subtitle={`Post #${item.id}`}
      content={item.body}
      style={styles.card}
    />
  ), []);

  const keyExtractor = useCallback((item: Post) => item.id.toString(), []);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  return (
    <View style={containerStyle}>
      <View style={styles.searchWrapper}>
        <CustomSearchbar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search posts..."
         />
      </View>

      <CustomFlatList
        data={filteredPosts}
        keyExtractor={keyExtractor}
        renderItem={renderPostItem}
        loading={viewModel.isLoading}
        refreshing={viewModel.isRefreshing}
        onRefresh={viewModel.refreshPosts}
        contentContainerStyle={styles.listContent}
        emptyText={viewModel.errorMessage ?? 'No posts found'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 4,
  },
});

export default PostsTab;
