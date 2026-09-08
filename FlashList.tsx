import { ComponentListProps, Item } from "./types";
import { FlashList } from "@shopify/flash-list";
import { memo, useRef } from "react";
import { DEFAULT_VIEWABILITY_CONFIG, REMOVE_CLIPPED_SUBVIEWS } from "./FlatList";
import { ViewabilityConfigCallbackPairs } from "@shopify/flash-list/dist/FlashListProps";

export const FlashListComponent = memo(({ onViewableItemsChanged, ...props }: ComponentListProps) => {
  const viewabilityConfigCallbackPairsEnhanced = useRef<ViewabilityConfigCallbackPairs<Item>>([
    {
      onViewableItemsChanged: onViewableItemsChanged ?? null,
      viewabilityConfig: DEFAULT_VIEWABILITY_CONFIG,
    },
  ]).current;

  return (
    <FlashList {...props}
      removeClippedSubviews={REMOVE_CLIPPED_SUBVIEWS}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairsEnhanced}
    />
  );
})