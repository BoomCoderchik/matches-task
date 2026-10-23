import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = {
  active: boolean;
  onPress: () => void;
};

// Звёздочка «в избранное».
export function FavoriteButton({ active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.65 }]}
    >
      <Text style={[styles.star, active && styles.active]}>{active ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  star: {
    fontSize: 22,
    color: colors.muted,
  },
  active: {
    color: colors.accent,
  },
});
