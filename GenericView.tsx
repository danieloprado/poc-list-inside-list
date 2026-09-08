import { FunctionComponent, useCallback, useEffect, useState, useMemo, useRef, memo } from "react";
import { View, StyleProp, ViewStyle, Platform, LayoutAnimation, LayoutChangeEvent, ViewToken } from "react-native";

import { FlatListWithOffsetContext } from "./FlatListWithOffsetContext";

import { LayoutItem } from "./types";

const CARD_VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 1, waitForInteraction: false };


export const GenericView = memo(({
  items = [],
}: { items: LayoutItem[] }) => {
  /**
   * Triggers fetch card when item is visible
   */
  // const onViewableItemsChangedFetch = useNativeLazyLoading(items, dispatchFetchCards);
  // const onViewableItemsChangedSticky = useStickyObserver(stickyIndexes);
  // const setVisibility = useVisibility();
  const [scrollableAreaHeight, setScrollableAreaHeight] = useState(0);
  // const { onScroll } = useGenericViewScrollListener();

  // returns -infinity when the list is empty
  // const lastStickyIndex = Math.max(...stickyIndexes);
  const initialNumToRender = Infinity;

  const renderItemComponent = useCallback(
    ({ item: { id, Component } }: { item: LayoutItem }) => (
      <View key={id}>
        <Component />
      </View>
    ),
    [items],
  );

  const onScrollableAreaLayoutChange = useCallback(
    (event: LayoutChangeEvent) => setScrollableAreaHeight(event.nativeEvent.layout.height),
    [],
  );

  const HeaderComponent = useMemo(
    () => <View style={{ height: 50, backgroundColor: 'lightgray' }} />,
    [],
  );

  const FooterComponent = useMemo(
    () => <View style={{ height: 150, backgroundColor: 'lightgray' }} />,
    [],
  );
  // const PullRefreshMemo = useMemo(() => <ConnectedPullRefresh component={PullRefresh} viewUrn={viewUrn} />, [viewUrn]);

  const ref = useRef(null);

  return (
    <FlatListWithOffsetContext
      listRef={ref}
      style={{ flex: 1, borderColor: 'red', borderWidth: 5, borderStyle: 'solid' }}
      onLayout={onScrollableAreaLayoutChange}
      // refreshControl={PullRefreshMemo}
      initialNumToRender={initialNumToRender}
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={FooterComponent}
      // contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      data={items}
      renderItem={renderItemComponent}
      stickyHeaderIndices={[0]}
      removeClippedSubviews={false} // When true, empty sticky indexes crash Android
      // onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={CARD_VIEWABILITY_CONFIG}
    // onScroll={onScroll}
    />
  );
});
