import { OnViewableItemsChangedInfo } from "@legendapp/list/react-native";
import { ViewToken } from "@shopify/flash-list";
import { FC } from "react";
import { ViewToken as FlatListViewToken } from "react-native";

export type LayoutItem = { id: number, Component: FC<any> }

export type Item = { id: number, title: string }

export type OnViewableItemsChangedInfoType = OnViewableItemsChangedInfo<Item>
  | { viewableItems: ViewToken<Item>[]; changed: ViewToken<Item>[]; }
  | { viewableItems: FlatListViewToken<Item>[]; changed: FlatListViewToken<Item>[]; }

export interface ComponentListProps {
  data: Item[];
  keyExtractor: (item: Item, index: number) => string;
  renderItem: (info: { item: Item, index: number }) => NonNullable<React.ReactElement>;
  onViewableItemsChanged?: (info: OnViewableItemsChangedInfoType) => void;
}