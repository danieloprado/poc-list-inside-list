import { StatusBar } from 'expo-status-bar';
import { createElement, memo, Profiler, useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashListComponent } from './FlashList';
import { LegendListComponent } from './LegendList';
import { Item, OnViewableItemsChangedInfoType } from './types';
import { FlatListComponent } from './FlatList';
import { useRenderStore } from './store';
import { Logger } from './Logger';
import { GenericView } from './GenericView';

export const data = new Array(100).fill(null).map((_, index) => ({ id: index, title: `Item ${index + 1}` }));

const ComponentsList = {
  'flash-list': FlashListComponent,
  'legend-list': LegendListComponent,
  'flat-list': FlatListComponent,
};

export default function App() {
  const renderKey = useRenderStore(state => `render-${state.renderKey}`);
  return <Lists key={renderKey} />;
}

function Lists() {
  const list = useRenderStore(state => state.list);
  const enableScrollView = useRenderStore(state => state.enableScrollView);

  const ListComponent = useMemo(() => {
    return ComponentsList[list];
  }, [list]);


  const renderItem = useCallback(({ item, index }: { item: { id: number; title: string }; index: number }) => {
    return <ItemC key={item.id} item={item} index={index} />
  }, []);

  const keyExtractor = useCallback((item: Item) => item.id.toString(), []);

  const onViewableItemsChanged = useCallback((info: OnViewableItemsChangedInfoType) => {
    useRenderStore.getState().setViewableItems(...info.viewableItems.map(v => v.item.id));
  }, [])

  const GenericViewItems = useMemo(() => {
    return [
      {
        id: performance.now(),
        Component: () => <View style={{ height: 50, backgroundColor: 'purple' }} />
      },
      {
        id: performance.now(),
        Component: () => <View style={{ height: 50, backgroundColor: 'yellow' }} />
      },
      {
        id: performance.now(),
        Component: () => <View style={{ flex: 1, padding: 5 }}><ListComponent data={data} renderItem={renderItem} keyExtractor={keyExtractor} onViewableItemsChanged={onViewableItemsChanged} /></View>
      }];
  }, [list]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Logger />

      <View style={{ flexDirection: 'row', padding: 10, gap: 10, width: '100%' }}>
        <Pressable style={[styles.button, list === 'flash-list' && styles.buttonActive]} onPress={() => useRenderStore.getState().setList('flash-list')}>
          <Text style={[styles.buttonText, list === 'flash-list' && styles.buttonTextActive]}>FlashList</Text>
        </Pressable>
        <Pressable style={[styles.button, list === 'legend-list' && styles.buttonActive]} onPress={() => useRenderStore.getState().setList('legend-list')}>
          <Text style={[styles.buttonText, list === 'legend-list' && styles.buttonTextActive]}>LegendList</Text>
        </Pressable>
        <Pressable style={[styles.button, list === 'flat-list' && styles.buttonActive]} onPress={() => useRenderStore.getState().setList('flat-list')}>
          <Text style={[styles.buttonText, list === 'flat-list' && styles.buttonTextActive]}>Flatlist</Text>
        </Pressable>
        <Pressable style={[styles.button, enableScrollView && styles.buttonActive]} onPress={() => useRenderStore.getState().toggleScrollView()}>
          <Text style={[styles.buttonText, enableScrollView && styles.buttonTextActive]}>App Structure</Text>
        </Pressable>
      </View>

      {!enableScrollView && <>
        <View style={{ flex: 1, width: '100%' }}>
          <ListComponent data={data} renderItem={renderItem} keyExtractor={keyExtractor} onViewableItemsChanged={onViewableItemsChanged} />
        </View>
      </>}

      {enableScrollView && <>
        <GenericView items={GenericViewItems} />
      </>}
    </SafeAreaView>
  );
}

const ItemC = memo(({ item, index }: { item: Item, index: number }) => {
  // blockJS(80);

  return <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }} onLayout={() => useRenderStore.getState().setRenderedItem(index)}>
    <Text>{item.title}</Text>
  </View>
})

const blockJS = (ms: number) => {
  const start = performance.now();

  while (performance.now() - start < ms) {
    // intentionally block JS
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 10
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: 'blue'
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonTextActive: {
    color: 'white',
  },
});
