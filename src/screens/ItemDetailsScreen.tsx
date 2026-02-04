import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import { ItemDetailScreen } from '@/screens/ItemDetailScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

export function ItemDetailsScreen({ route, navigation }: Props) {
  return <ItemDetailScreen route={route} navigation={navigation} />;
}
