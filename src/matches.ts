export type Club = { id: string; name: string; city: string };
export type Match = {
  id: string;
  startsAt: string | null;
  status: string;
  minute?: number;
  home: Club;
  away: Club;
  score: { home: number; away: number } | null;
};
export type MatchesData = { round: number; matches: Match[] };
export type Filter = 'all' | 'upcoming' | 'finished';

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const integer = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;
const club = (value: unknown): value is Club =>
  record(value) && text(value.id) && text(value.name) && typeof value.city === 'string';

export function parseMatches(value: unknown): MatchesData {
  if (!record(value) || !integer(value.round) || !Array.isArray(value.matches)) {
    throw new Error('Некорректный ответ сервера');
  }
  const ids = new Set<string>();
  for (const match of value.matches) {
    if (!record(match) || !text(match.id) || ids.has(match.id) ||
        !text(match.status) || !club(match.home) || !club(match.away) ||
        !(match.startsAt === null || typeof match.startsAt === 'string') ||
        !(match.minute === undefined || integer(match.minute)) ||
        !(match.score === null || (record(match.score) && integer(match.score.home) && integer(match.score.away)))) {
      throw new Error('Некорректные данные матча');
    }
    ids.add(match.id);
  }
  return value as MatchesData;
}

export function filterMatches(matches: Match[], filter: Filter, query = ''): Match[] {
  const search = query.trim().toLocaleLowerCase('ru-RU');
  return matches.filter((match) => {
    const inFilter = filter === 'all' || (filter === 'finished'
      ? match.status === 'finished'
      : match.status === 'scheduled' || match.status === 'postponed');
    return inFilter && [match.home.name, match.away.name].some((name) =>
      name.toLocaleLowerCase('ru-RU').includes(search));
  });
}

export function matchStatus(match: Match): string {
  switch (match.status) {
    case 'scheduled': return 'Предстоит';
    case 'finished': return 'Завершён';
    case 'postponed': return 'Перенесён';
    case 'live': return match.minute == null ? 'Идёт матч' : `Идёт матч · ${match.minute} мин`;
    default: return 'Статус уточняется';
  }
}

export function matchDate(startsAt: string | null): string {
  if (!startsAt || Number.isNaN(Date.parse(startsAt))) return 'Дата и время уточняются';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(startsAt));
}
