import React from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors as c } from '../../theme';
export function Button({ children, onPress, secondary = false, danger = false, disabled = false, busy = false, label, hint, style, ...rest }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label || (typeof children === 'string' ? children : undefined)} accessibilityHint={hint} accessibilityState={{ disabled: disabled || busy, busy }} onPress={onPress} disabled={disabled || busy} style={({ pressed }) => [styles.button, secondary && styles.secondary, danger && { backgroundColor: c.paleRed }, (disabled || busy) && { opacity: 0.55 }, pressed && { opacity: 0.8 }, style]} {...rest}>
    {busy && <ActivityIndicator color={secondary ? c.ink : '#fff'} />}
    <Text style={[styles.buttonText, secondary && { color: c.ink }, danger && { color: c.red }]}>{children}</Text>
  </Pressable>;
}
export function Field({ label, error, style, ...props }) {
  return <View style={[{ gap: 8, marginBottom: 16 }, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={c.muted} style={[styles.input, error && { borderColor: c.red }]} {...props} />
    {!!error && <Notice error>{error}</Notice>}
  </View>;
}
export function Notice({ children, error = false }) {
  return <View accessibilityLiveRegion="polite" style={[styles.notice, error && { backgroundColor: c.paleRed }]}><Text style={{ color: error ? c.red : c.green, fontSize: 14, lineHeight: 22, flexShrink: 1 }}>{children}</Text></View>;
}
export const Heading = ({ children, style }) => <Text accessibilityRole="header" style={[styles.heading, style]}>{children}</Text>;
export function Chip({ children, selected, onPress, label }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={label || children} onPress={onPress} style={({ pressed }) => [styles.chip, selected && { backgroundColor: c.ink, borderColor: c.ink }, pressed && { opacity: .7 }]}><Text style={{ fontSize: 14, color: selected ? '#fff' : c.ink, fontWeight: '600' }}>{children}</Text></Pressable>;
}
export const styles = StyleSheet.create({
  button: { minWidth: 48, minHeight: 48, paddingHorizontal: 18, paddingVertical: 13, backgroundColor: c.green, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  secondary: { backgroundColor: c.mint }, buttonText: { fontSize: 15, lineHeight: 22, fontWeight: '700', color: '#fff', textAlign: 'center', flexShrink: 1 },
  label: { fontSize: 14, fontWeight: '600', color: c.ink },
  input: { minHeight: 52, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: c.line, color: c.ink, backgroundColor: '#fff', fontSize: 16 },
  notice: { padding: 14, borderRadius: 14, backgroundColor: c.mint, marginVertical: 8 },
  heading: { color: c.ink, fontWeight: '800', fontSize: 24, lineHeight: 32 },
  chip: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 24, borderWidth: 1, borderColor: c.line, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }
});
