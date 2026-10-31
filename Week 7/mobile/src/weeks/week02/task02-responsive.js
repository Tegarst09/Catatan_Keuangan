import { useWindowDimensions } from 'react-native';
export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  return { width, height, fontScale, compact: width < 360, wide: width >= 768, landscape: width > height, padding: width >= 768 ? 28 : 18 };
}
