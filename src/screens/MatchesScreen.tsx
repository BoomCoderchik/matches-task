import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { Icon } from '../components/Icon';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { Filter, filterMatches } from '../matches';
import { colors, displayFont } from '../theme';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

export function MatchesScreen() {
  const { data, loading, error, updatedAt, refresh } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const matches = data?.matches ?? [];
  const visible = filterMatches(matches, filter, query);
  const hasSelection = query.length > 0 || filter !== 'all';

  const reset = () => { setQuery(''); setFilter('all'); };
  const header = (
    <View>
      <View style={styles.masthead}>
        <Text style={styles.brand}>МАТЧ-ЦЕНТР</Text>
        <Text style={styles.brandNote}>Футбол</Text>
      </View>
      <View style={styles.headingRow}>
        <View style={styles.headingGroup}>
          <Text accessibilityRole="header" style={[styles.title, compact && styles.compactTitle]}>Матчи тура</Text>
          <Text style={styles.subtitle}>
            {data ? `Тур ${data.round} · ${matches.length} матчей` : 'Расписание и результаты'}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: loading }} aria-disabled={loading}
          disabled={loading} onPress={() => void refresh()}
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [styles.refresh, loading && styles.disabled, (pressed || hovered) && styles.highlight]}>
          <Icon name="refresh" size={16} color={colors.muted} />
          <Text style={styles.refreshText}>{loading ? 'Загрузка…' : 'Обновить'}</Text>
        </Pressable>
      </View>
      <View style={styles.controls}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {filters.map(({ value, label }) => (
            <Pressable key={value} accessibilityRole="tab" accessibilityLabel={label}
              accessibilityState={{ selected: filter === value }} aria-selected={filter === value}
              onPress={() => setFilter(value)} style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [styles.tab, filter === value && styles.selectedTab, (pressed || hovered) && styles.highlight]}>
              <Text style={[styles.tabText, filter === value && styles.selectedText]}>{label}</Text>
              {data ? <Text style={[styles.tabCount, filter === value && styles.selectedText]}>{filterMatches(matches, value).length}</Text> : null}
            </Pressable>
          ))}
        </View>
        <View style={[styles.searchBox, compact && styles.compactSearchBox]}>
          <Icon name="search" size={17} color={colors.muted} />
          <TextInput accessibilityLabel="Поиск по названию клуба" placeholder="Найти клуб"
            placeholderTextColor={colors.muted} value={query} onChangeText={setQuery}
            autoCorrect={false} style={styles.search} />
        </View>
      </View>
      {error ? (
        <View accessibilityRole="alert" style={styles.error}>
          <Text style={styles.errorTitle}>{data ? 'Не удалось обновить' : 'Матчи недоступны'}</Text>
          <Text style={styles.errorText}>{error}</Text>
          {data ? <Text style={styles.errorText}>Показаны данные последней успешной загрузки.</Text> : null}
          <Pressable accessibilityRole="button" onPress={() => void refresh()} style={styles.retry}>
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={visible}
        keyExtractor={(match) => match.id} extraData={favorites}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MatchCard match={item} favorite={isFavorite(item.id)} onToggle={() => toggle(item.id)} compact={compact} />
          </View>
        )}
        ListEmptyComponent={loading && !data ? (
          <View style={styles.empty}>
            <ActivityIndicator color={colors.accent} accessibilityLabel="Загрузка матчей" />
            <Text style={styles.emptyTitle}>Загружаем матчи</Text>
            <Text style={styles.emptyText}>Получаем расписание и результаты.</Text>
          </View>
        ) : !error || data ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{matches.length ? 'Матчи не найдены' : 'Матчей пока нет'}</Text>
            <Text style={styles.emptyText}>{matches.length ? 'Попробуйте другой клуб или выберите все матчи.' : 'Расписание появится после публикации. Попробуйте обновить позже.'}</Text>
            {hasSelection ? <Pressable accessibilityRole="button" onPress={reset} style={styles.retry}><Text style={styles.retryText}>Сбросить фильтры</Text></Pressable> : null}
          </View>
        ) : null}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.timezone}>Время указано в вашем часовом поясе</Text>
            {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
          </View>
        }
        keyboardShouldPersistTaps="handled" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 36 },
  masthead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.ink, paddingVertical: 24, marginBottom: 36 },
  brand: { color: colors.ink, fontFamily: displayFont, fontSize: 23, letterSpacing: -0.3 },
  brandNote: { color: colors.muted, fontSize: 13 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  headingGroup: { gap: 10 },
  title: { fontFamily: displayFont, fontSize: 46, lineHeight: 50, letterSpacing: -0.7, color: colors.ink },
  compactTitle: { fontSize: 34, lineHeight: 40 },
  subtitle: { fontSize: 13, color: colors.muted },
  refresh: { flexDirection: 'row', gap: 8, minHeight: 44, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  refreshText: { color: colors.ink, fontWeight: '500', fontSize: 13 },
  disabled: { opacity: 0.6 },
  highlight: { backgroundColor: colors.surface },
  timezone: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 16, columnGap: 24, justifyContent: 'space-between', marginTop: 30, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: colors.line },
  tabs: { flexDirection: 'row', gap: 16 },
  tab: { flexDirection: 'row', gap: 6, minWidth: 44, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  selectedTab: { borderBottomColor: colors.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  tabCount: { fontSize: 12, color: colors.muted, fontVariant: ['tabular-nums'] },
  selectedText: { color: colors.accent },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, flexGrow: 1, maxWidth: 230, minWidth: 160, marginVertical: 8, paddingHorizontal: 12, borderRadius: 4, backgroundColor: colors.surface },
  compactSearchBox: { width: '100%', maxWidth: '100%', flexGrow: 0 },
  search: { flex: 1, minWidth: 0, minHeight: 44, color: colors.ink, fontSize: 13 },
  item: { flex: 1, minWidth: 0 },
  error: { borderRadius: 12, backgroundColor: colors.accentSoft, padding: 20, gap: 10, marginBottom: 20 },
  errorTitle: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  errorText: { fontSize: 14, lineHeight: 21, color: colors.ink },
  retry: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  retryText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  empty: { paddingVertical: 52, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.ink },
  emptyText: { maxWidth: 360, textAlign: 'center', fontSize: 14, lineHeight: 22, color: colors.muted },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, paddingTop: 20 },
});
