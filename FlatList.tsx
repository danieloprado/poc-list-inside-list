import { memo, useCallback, useRef } from "react";
import * as React from "react";
import {
  FlatList as ReactNativeFlatlist,
  FlatListProps as ReactNativeFlatListProps,
  ViewToken,
  ListRenderItem,
  ViewabilityConfigCallbackPairs,
  ViewProps,
} from "react-native";
import { Item } from "./types";

export const INITIAL_NUM_TO_RENDER = 2;
export const MAX_TO_RENDER_PER_BATCH = 5;
export const REMOVE_CLIPPED_SUBVIEWS = false;
export const UPDATE_CELLS_BATCHING_PERIOD = 50;
export const WINDOW_SIZE = 5;

type ViewableItemsChanged = {
  viewableItems: ViewToken[];
  changed: ViewToken[];
};

export type OnViewableItemsChanged = ({ changed, viewableItems }: ViewableItemsChanged) => void;

export type ViewabilityProps = {
  viewabilityConfig: {
    minimumViewTime?: number;
    itemVisiblePercentThreshold?: number;
    waitForInteraction?: boolean;
  };

  onViewableItemsChanged: OnViewableItemsChanged;
};

export const DEFAULT_VIEWABILITY_CONFIG: ViewabilityProps["viewabilityConfig"] = {
  minimumViewTime: 0,
  itemVisiblePercentThreshold: 0,
  waitForInteraction: false,
};

export type RenderItem<T> = ListRenderItem<T>;

type FlatListWhiteListProps<T> = Pick<
  ReactNativeFlatListProps<T>,
  | "bounces"
  | "contentContainerStyle"
  | "data"
  | "decelerationRate"
  | "getItemLayout"
  | "horizontal"
  | "initialNumToRender"
  | "ItemSeparatorComponent"
  | "keyboardDismissMode"
  | "keyboardShouldPersistTaps"
  | "ListHeaderComponent"
  | "ListHeaderComponentStyle"
  | "ListFooterComponent"
  | "ListFooterComponentStyle"
  | "maxToRenderPerBatch"
  | "numColumns"
  | "onLayout"
  | "onMomentumScrollEnd"
  | "onEndReached"
  | "onEndReachedThreshold"
  | "onScroll"
  | "onScrollEndDrag"
  | "onScrollToIndexFailed"
  | "onViewableItemsChanged"
  | "pagingEnabled"
  | "refreshControl"
  | "removeClippedSubviews"
  | "scrollEnabled"
  | "scrollEventThrottle"
  | "showsHorizontalScrollIndicator"
  | "showsVerticalScrollIndicator"
  | "snapToInterval"
  | "stickyHeaderIndices"
  | "style"
  | "updateCellsBatchingPeriod"
  | "viewabilityConfig"
  | "viewabilityConfigCallbackPairs"
  | "windowSize"
  | "columnWrapperStyle"
>;

export type FlatListProps<T = Item> = FlatListWhiteListProps<T> & {
  CellRendererComponent?: React.ComponentType<ViewProps> | null | undefined;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  renderItem: ListRenderItem<T> | null | undefined;
  keyExtractor?: ((item: T, index: number) => string) | undefined;

  /**
   * Reference that will be passed to the react native original FlatList. Why not use forwardRef normal ref? If we do
   * creating a Generic function component would not be possible.
   */
  listRef?: React.RefObject<ReactNativeFlatlist | null> | undefined;
};

/**
 * Thin wrapper around React Native FlatList with sensible defaults for TBD.
 * Visibility is managed externally via useVisibilityStatus — this component
 * does not track or inject visibility state.
 *
 * @param props All the same props as the original React Native Flatlist
 * @returns Flatlist
 */

function FlatListComponentRaw({
  data,
  initialNumToRender = INITIAL_NUM_TO_RENDER,
  keyExtractor,
  keyboardShouldPersistTaps = "handled",
  listRef,
  maxToRenderPerBatch = MAX_TO_RENDER_PER_BATCH,
  onViewableItemsChanged,
  removeClippedSubviews = REMOVE_CLIPPED_SUBVIEWS,
  renderItem,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
  updateCellsBatchingPeriod = UPDATE_CELLS_BATCHING_PERIOD,
  viewabilityConfig,
  viewabilityConfigCallbackPairs,
  windowSize = WINDOW_SIZE,
  ...props
}: FlatListProps) {
  // eslint-disable-next-line react-hooks/refs -- Changes on the fly of the viewability config, pairs or callback throw an error, hence the useRef
  const viewabilityConfigCallbackPairsEnhanced = useRef<ViewabilityConfigCallbackPairs>([
    ...(viewabilityConfigCallbackPairs || []),
    {
      onViewableItemsChanged: onViewableItemsChanged ?? null,
      viewabilityConfig: viewabilityConfig || DEFAULT_VIEWABILITY_CONFIG,
    },
  ]).current;

  const keyExtractorWrapper = useCallback(
    (item: Item, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }

      return `${item.id}`;
    },
    [keyExtractor],
  );

  const { CellRendererComponent, ...restProps } = props;

  return (
    <ReactNativeFlatlist
      {...restProps}
      // CellRendererComponent={CellRendererComponent as ReactNativeFlatListProps<Item>["CellRendererComponent"]}
      data={data}
      initialNumToRender={initialNumToRender}
      keyExtractor={keyExtractorWrapper}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      maxToRenderPerBatch={maxToRenderPerBatch}
      ref={listRef}
      removeClippedSubviews={removeClippedSubviews}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairsEnhanced}
      windowSize={2}
    />
  );
}

export const FlatListComponent = memo(FlatListComponentRaw)