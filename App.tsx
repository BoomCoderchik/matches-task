import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { MatchesScreen } from './src/screens/MatchesScreen';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    RobotoCondensedBold: require('./assets/fonts/RobotoCondensed-Bold.ttf'),
  });
  if (!fontsLoaded && !fontError) {
    return <View style={styles.loading}><ActivityIndicator color="#bd342a" /></View>;
  }
  return (
    <View style={styles.root}>
      <MatchesScreen />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 0 : 48,
    backgroundColor: '#fff',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
