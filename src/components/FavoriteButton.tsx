import { Platform, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Icon } from './Icon';

type Props = {
  active: boolean;
  onPress: () => void;
};

// Звёздочка «в избранное».
export function FavoriteButton({ active, onPress }: Props) {
  return (
    <Pressable
      {...(Platform.OS === 'web' ? { 'aria-pressed': active } : {})}
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      accessibilityState={{ selected: active }}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [styles.button, (pressed || hovered) && styles.highlight]}
    >
      <Icon name="star" size={20} color={active ? colors.accent : colors.muted} filled={active} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  highlight: { backgroundColor: colors.surface },
});
