import { StyleSheet, Text, View } from 'react-native';
import { Match, matchDate, matchStatus } from '../matches';
import { colors } from '../theme';
import { FavoriteButton } from './FavoriteButton';

type Props = { match: Match; favorite: boolean; onToggle: () => void };

export function MatchCard({ match, favorite, onToggle }: Props) {
  const live = match.status === 'live';
  const postponed = match.status === 'postponed';
  return (
    <View style={styles.card} testID={`match-${match.id}`}>
      <View style={styles.top}>
        <View style={[styles.badge, live && styles.liveBadge, postponed && styles.postponedBadge]}>
          {live ? <View style={styles.liveDot} /> : null}
          <Text style={[styles.status, live && styles.liveText, postponed && styles.postponedText]}>
            {matchStatus(match)}
          </Text>
        </View>
        <FavoriteButton active={favorite} onPress={onToggle} />
      </View>
      <View style={styles.match}>
        <View style={styles.club}>
          <Text style={styles.clubName}>{match.home.name}</Text>
          <Text style={styles.city}>{match.home.city}</Text>
        </View>
        <View style={styles.scoreBlock}>
          <Text style={[styles.score, live && styles.liveText]}
            accessibilityLabel={match.score ? `Счёт ${match.score.home} : ${match.score.away}` : 'Счёта пока нет'}>
            {match.score ? `${match.score.home} : ${match.score.away}` : '— : —'}
          </Text>
          <Text style={styles.scoreCaption}>{match.score ? 'СЧЁТ' : 'НАЧАЛО ВПЕРЕДИ'}</Text>
        </View>
        <View style={[styles.club, styles.away]}>
          <Text style={[styles.clubName, styles.alignRight]}>{match.away.name}</Text>
          <Text style={[styles.city, styles.alignRight]}>{match.away.city}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.date}>{matchDate(match.startsAt)}</Text>
        <Text style={styles.venue}>Хозяева — гости</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: colors.line, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 6, backgroundColor: colors.background, paddingHorizontal: 9, paddingVertical: 5 },
  status: { fontSize: 12, fontWeight: '600', color: colors.muted },
  liveBadge: { backgroundColor: colors.liveSoft },
  liveText: { color: colors.live },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  postponedBadge: { backgroundColor: colors.accentSoft },
  postponedText: { color: colors.accent },
  match: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 22 },
  club: { flex: 1, minWidth: 0, gap: 6 },
  clubName: { fontSize: 17, lineHeight: 23, fontWeight: '700', color: colors.ink },
  city: { fontSize: 12, lineHeight: 17, color: colors.muted },
  away: { alignItems: 'flex-end' },
  alignRight: { textAlign: 'right' },
  scoreBlock: { alignItems: 'center', width: 96, gap: 5 },
  score: { fontSize: 30, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  scoreCaption: { fontSize: 8, letterSpacing: 0.6, color: colors.muted, textAlign: 'center' },
  bottom: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, gap: 6, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  date: { fontSize: 12, color: colors.muted },
  venue: { fontSize: 11, color: colors.muted },
});
