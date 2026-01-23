import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type RowItem = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  title: string;
  data: RowItem[];
  emptyText: string;
};

export function ProfileListSection({ title, data, emptyText }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text style={styles.empty}>{emptyText}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  row: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
  },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  rowSubtitle: { marginTop: 4, color: '#666' },
  separator: { height: 10 },
  empty: { marginTop: 12, color: '#666' },
});
