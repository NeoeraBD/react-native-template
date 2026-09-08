import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies } from '@app/ui';

interface TrendingItem {
  id: number;
  title: string;
  category: string;
  views: string;
  icon: string;
}

const TRENDING: TrendingItem[] = [
  { id: 1, title: 'React Native 0.85 Released', category: 'Mobile Dev', views: '12.4K', icon: 'cellphone' },
  { id: 2, title: 'MobX State Tree Best Practices', category: 'State Management', views: '8.1K', icon: 'state-machine' },
  { id: 3, title: 'React Navigation v7 Deep Dive', category: 'Navigation', views: '6.7K', icon: 'routes' },
  { id: 4, title: 'Building Offline-First Apps', category: 'Architecture', views: '5.2K', icon: 'cloud-off-outline' },
  { id: 5, title: 'Hermes Engine Performance Tips', category: 'Performance', views: '4.9K', icon: 'lightning-bolt' },
  { id: 6, title: 'react-native-mmkv vs AsyncStorage', category: 'Storage', views: '3.8K', icon: 'database' },
];

export const TrendingTab = observer(() => {
  const theme = useTheme();

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  // TRENDING is static — only recompute rendered items when theme changes
  const trendingItems = useMemo(
    () =>
      TRENDING.map((item, index) => (
        <Surface
          key={item.id}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <View style={[styles.rank, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.rankText, { color: theme.colors.primary }]}>
              {index + 1}
            </Text>
          </View>

          <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={22} color={theme.colors.primary} />
          </View>

          <View style={styles.textWrapper}>
            <Text
              variant="titleSmall"
              style={[styles.title, { color: theme.colors.onSurface }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View style={styles.meta}>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant, fontFamily: fontFamilies.medium }}
              >
                {item.category}
              </Text>
              <View style={[styles.dot, { backgroundColor: theme.colors.outlineVariant }]} />
              <Icon name="eye-outline" size={12} color={theme.colors.onSurfaceVariant} />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 3, fontFamily: fontFamilies.medium }}
              >
                {item.views}
              </Text>
            </View>
          </View>
        </Surface>
      )),
    [theme],
  );

  return (
    <ScrollView style={containerStyle} contentContainerStyle={styles.content}>
      <Text
        variant="labelLarge"
        style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}
      >
        Trending this week
      </Text>
      {trendingItems}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  iconWrapper: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
});

export default TrendingTab;
