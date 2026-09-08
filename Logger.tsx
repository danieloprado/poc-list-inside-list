import { memo, useRef } from "react";
import { useRenderStore } from "./store";
import { View, Text } from "react-native";
import { data } from "./App";

export const Logger = memo(() => {
  const list = useRenderStore(state => state.list);
  const renderKey = useRenderStore(state => state.renderKey);
  const viewableItems = useRenderStore(state => state.viewableItems);
  const renderedItems = useRenderStore(state => state.renderedItems);
  const firstRenderRef = useRef(true);


  if (firstRenderRef.current) {
    console.log(`\n\n\nFirst render, list is ${list}`);
    firstRenderRef.current = false;
  }


  // console.log(
  //   JSON.stringify(HermesInternal.getInstrumentedStats(), null, 2)
  // );


  // console.log('Viewable Items:', viewableItems);
  // console.log('Rendered Items:', renderedItems);

  return <View>
    <Text>List: {list}</Text>
    <Text>Items: {data.length}</Text>
    <Text>Viewable Items: {viewableItems.length}</Text>
    <Text>Rendered Items: {renderedItems.length}</Text>
    {/* <Text>Timelapse: {(performance.now() - renderKey).toFixed(2)}ms</Text> */}
  </View>;
})

const formatHermesStats = (stats: Record<string, number>) => {
  const bytes = (value: number) =>
    value < 1024
      ? `${value} B`
      : value < 1024 ** 2
        ? `${(value / 1024).toFixed(1)} KB`
        : `${(value / 1024 ** 2).toFixed(1)} MB`;

  const ms = (value: number) => `${(value * 1000).toFixed(2)} ms`;

  return {
    gcRuns: stats.js_numGCs,
    gcCPUTime: ms(stats.js_gcCPUTime),
    gcTime: ms(stats.js_gcTime),
    totalAllocated: bytes(stats.js_totalAllocatedBytes),
    allocated: bytes(stats.js_allocatedBytes),
    heapSize: bytes(stats.js_heapSize),
    mallocSizeEstimate: bytes(stats.js_mallocSizeEstimate),
    vaSize: bytes(stats.js_vaSize),
    externalBytes: bytes(stats.js_externalBytes),
    markStackOverflows: stats.js_markStackOverflows,
  };
};