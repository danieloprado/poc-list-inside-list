import { useCallback } from "react";
import * as React from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
// import { useUpdateScrollOffsetContext, useUpdateScrollIdleContext } from "@ppb/the-wall-native/helpers/ScrollContext";
// import { useScrollToTop } from "@ppb/tbd-router/native";
import { FlatListComponent as FlatList, FlatListProps } from "./FlatList";
import { Item } from "./types";

export const FlatListWithOffsetContext: React.FC<FlatListProps<any>> = (props) => {
  return (
    <FlatList
      {...props}
      scrollEventThrottle={32}
    />
  );
};
