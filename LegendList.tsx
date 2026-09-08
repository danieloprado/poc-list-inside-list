import { ComponentListProps, Item } from "./types";
import { LegendList, ViewabilityConfigCallbackPairs } from "@legendapp/list/react-native";
import { memo, useRef } from "react";
import { DEFAULT_VIEWABILITY_CONFIG } from "./FlatList";

export const LegendListComponent = memo(({ onViewableItemsChanged, ...props }: ComponentListProps) => {
  const viewabilityConfigCallbackPairsEnhanced = useRef<ViewabilityConfigCallbackPairs<Item>>([
    {
      onViewableItemsChanged: onViewableItemsChanged ?? null,
      viewabilityConfig: DEFAULT_VIEWABILITY_CONFIG,
    },
  ]).current;

  return (
    <LegendList {...props} recycleItems viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairsEnhanced} />
  );
})