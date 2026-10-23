import { StyleSheet, Text, View } from 'react-native';
import { Match, matchDate, matchStatus } from '../matches';
import { colors, displayFont } from '../theme';
import { FavoriteButton } from './FavoriteButton';

type Props = { match: Match; favorite: boolean; onToggle: () => void; compact: boolean };

export function MatchCard({ match, favorite, onToggle, compact }: Props) {
  const live = match.status === 'live';
  const postponed = match.status === 'postponed';
  return (
    <View style={[styles.row, compact && styles.compactRow, live && styles.liveRow]} testID={`match-${match.id}`}>
      <View style={[styles.metadata, compact && styles.compactMetadata]}>
        <Text style={styles.date}>{matchDate(match.startsAt)}</Text>
        <View style={styles.statusLine}>
          {live ? <View style={styles.liveDot} /> : null}
          <Text style={[styles.status, (live || postponed) && styles.accentText]}>{matchStatus(match)}</Text>
        </View>
      </View>
      <View style={[styles.teams, compact && styles.compactTeams]}>
        <View style={[styles.club, styles.home]}>
          <Text style={[styles.clubName, styles.homeText, compact && styles.compactClubName]}>{match.home.name}</Text>
          <Text style={[styles.city, styles.homeText]}>{match.home.city}</Text>
        </View>
        <View style={[styles.scoreBox, live && styles.liveScoreBox, !match.score && styles.noScoreBox]}>
          <Text style={[styles.score, live && styles.liveScore, !match.score && styles.noScore]}
            accessibilityLabel={match.score ? `Счёт ${match.score.home} : ${match.score.away}` : 'Счёта пока нет'}>
            {match.score ? `${match.score.home} : ${match.score.away}` : '— : —'}
          </Text>
        </View>
        <View style={styles.club}>
          <Text style={[styles.clubName, compact && styles.compactClubName]}>{match.away.name}</Text>
          <Text style={styles.city}>{match.away.city}</Text>
        </View>
      </View>
      <View style={[styles.favorite, compact && styles.compactFavorite]}>
        <FavoriteButton active={favorite} onPress={onToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 20, paddingVertical: 22, borderBottomWidth: 1, borderBottomColor: colors.line, minHeight: 105 },
  compactRow: { flexDirection: 'column', alignItems: 'stretch', gap: 18, paddingHorizontal: 14, paddingTop: 18, paddingBottom: 22 },
  liveRow: { backgroundColor: colors.liveSoft },
  metadata: { width: 160, gap: 7 },
  compactMetadata: { width: '100%', paddingRight: 42, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 10, rowGap: 6 },
  date: { fontSize: 12, lineHeight: 18, color: colors.muted },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  status: { fontSize: 12, lineHeight: 18, color: colors.muted },
  accentText: { color: colors.accent, fontWeight: '600' },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.live },
  teams: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 22, minWidth: 0 },
  compactTeams: { flex: undefined, gap: 12 },
  club: { flex: 1, minWidth: 0, gap: 4 },
  home: { alignItems: 'flex-end' },
  homeText: { textAlign: 'right' },
  clubName: { fontSize: 17, lineHeight: 23, fontWeight: '600', color: colors.ink },
  compactClubName: { fontSize: 15, lineHeight: 21 },
  city: { fontSize: 12, lineHeight: 17, color: colors.muted },
  scoreBox: { width: 78, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 4 },
  score: { fontFamily: displayFont, fontSize: 28, color: colors.ink, fontVariant: ['tabular-nums'] },
  liveScoreBox: { backgroundColor: colors.accent },
  liveScore: { color: colors.background },
  noScoreBox: { backgroundColor: 'transparent' },
  noScore: { fontSize: 22, color: colors.muted },
  favorite: { marginLeft: 4 },
  compactFavorite: { position: 'absolute', top: 8, right: 4, marginLeft: 0 },
});
