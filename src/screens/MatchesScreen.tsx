import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { Filter, filterMatches } from '../matches';
import { colors } from '../theme';

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
  const columns = width >= 1000 ? 2 : 1;
  const matches = data?.matches ?? [];
  const visible = filterMatches(matches, filter, query);
  const hasSelection = query.length > 0 || filter !== 'all';

  const reset = () => { setQuery(''); setFilter('all'); };
  const header = (
    <View>
      <View style={styles.masthead}>
        <Text style={styles.brand}>Матч-центр</Text>
        <Text style={styles.brandNote}>Футбол</Text>
      </View>
      <View style={styles.headingRow}>
        <View style={styles.headingGroup}>
          <Text accessibilityRole="header" style={styles.title}>Матчи тура</Text>
          <Text style={styles.subtitle}>
            {data ? `Тур ${data.round} · ${matches.length} матчей` : 'Расписание и результаты'}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: loading }}
          disabled={loading} onPress={() => void refresh()}
          style={({ pressed }) => [styles.refresh, loading && styles.disabled, pressed && styles.pressed]}>
          <Text style={styles.refreshText}>{loading ? 'Загрузка…' : 'Обновить'}</Text>
        </Pressable>
      </View>
      <View style={styles.updateRow}>
        <Text style={styles.timezone}>Время вашего устройства</Text>
        {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
      </View>
      <View style={styles.controls}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {filters.map(({ value, label }) => (
            <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }}
              onPress={() => setFilter(value)} style={({ pressed }) => [styles.tab, filter === value && styles.selectedTab, pressed && styles.pressed]}>
              <Text style={[styles.tabText, filter === value && styles.selectedText]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput accessibilityLabel="Поиск по названию клуба" placeholder="Найти клуб"
          placeholderTextColor={colors.muted} value={query} onChangeText={setQuery}
          autoCorrect={false} style={styles.search} />
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
      {data && visible.length > 0 ? (
        <View style={styles.listHeading}>
          <Text style={styles.listLabel}>Матчи · {visible.length}</Text>
          <Text style={styles.listNote}>Звёздочка добавляет в избранное</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList key={columns} data={visible} numColumns={columns}
        keyExtractor={(match) => match.id} extraData={favorites}
        contentContainerStyle={styles.content}
        columnWrapperStyle={columns > 1 ? styles.columns : undefined}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MatchCard match={item} favorite={isFavorite(item.id)} onToggle={() => toggle(item.id)} />
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
        ListFooterComponent={<Text style={styles.footer}>Расписание и результаты · Время указано в вашем часовом поясе</Text>}
        keyboardShouldPersistTaps="handled" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 28 },
  masthead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 18, marginBottom: 28 },
  brand: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  brandNote: { color: colors.muted, fontSize: 13 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  headingGroup: { gap: 8 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8, color: colors.ink },
  subtitle: { fontSize: 14, color: colors.muted },
  refresh: { minHeight: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: colors.accent },
  refreshText: { color: colors.surface, fontWeight: '700', fontSize: 14 },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.75 },
  updateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginTop: 20, marginBottom: 24 },
  timezone: { color: colors.muted, fontSize: 13 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 24 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, backgroundColor: '#e9edf1', padding: 4, borderRadius: 10 },
  tab: { minHeight: 44, paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center', borderRadius: 7 },
  selectedTab: { backgroundColor: colors.ink },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  selectedText: { color: colors.surface },
  search: { flexGrow: 1, minWidth: 160, maxWidth: 360, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 8, minHeight: 48, paddingHorizontal: 14, color: colors.ink, fontSize: 14 },
  listHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  listLabel: { fontSize: 13, fontWeight: '700', color: colors.ink },
  listNote: { fontSize: 12, color: colors.muted },
  columns: { gap: 16 },
  item: { flex: 1, minWidth: 0 },
  error: { borderRadius: 12, backgroundColor: colors.accentSoft, padding: 20, gap: 10, marginBottom: 20 },
  errorTitle: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  errorText: { fontSize: 14, lineHeight: 21, color: colors.ink },
  retry: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  retryText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  empty: { paddingVertical: 52, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.ink },
  emptyText: { maxWidth: 360, textAlign: 'center', fontSize: 14, lineHeight: 22, color: colors.muted },
  footer: { fontSize: 12, textAlign: 'center', color: colors.muted, lineHeight: 19, marginTop: 24 },
});
