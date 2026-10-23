import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

type Props = { name: 'star' | 'refresh' | 'search'; size?: number; color?: string; filled?: boolean };

export function Icon({ name, size = 20, color = colors.ink, filled = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden={true}>
      {name === 'star' ? (
        <Path d="m12 3 2.78 5.64L21 9.55l-4.5 4.39 1.06 6.2L12 17.21l-5.56 2.93 1.06-6.2L3 9.55l6.22-.91L12 3Z" fill={filled ? color : 'none'} />
      ) : name === 'search' ? (
        <><Circle cx={10.5} cy={10.5} r={6.5} /><Path d="m16 16 4.5 4.5" /></>
      ) : (
        <><Path d="M20 7v5h-5M4 17v-5h5" /><Path d="M5.5 8a7 7 0 0 1 11.55-2.65L20 8M4 16l2.95 2.65A7 7 0 0 0 18.5 16" /></>
      )}
    </Svg>
  );
}
