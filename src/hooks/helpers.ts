import shortid from "shortid";
import { ROW, COLUMN, COMPONENT } from "../constants/constants";

interface LayoutItem {
  type: string;
  id: string;
  children?: LayoutItem[];
}

export const reorder = (
  list: LayoutItem[],
  startIndex: number,
  endIndex: number
): LayoutItem[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const remove = (arr: LayoutItem[], index: number): LayoutItem[] => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

export const insert = (
  arr: LayoutItem[],
  index: number,
  newItem: LayoutItem
): LayoutItem[] => [...arr.slice(0, index), newItem, ...arr.slice(index)];

export const reorderChildren = (
  children: LayoutItem[],
  splitDropZonePath: string[],
  splitItemPath: string[]
): LayoutItem[] => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(
      nodeChildren.children || [],
      splitDropZoneChildrenPath,
      splitItemChildrenPath
    ),
  };

  return updatedChildren;
};

export const removeChildFromChildren = (
  children: LayoutItem[],
  splitItemPath: string[]
): LayoutItem[] => {
  if (splitItemPath.length === 1) {
    const itemIndex = Number(splitItemPath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitItemPath.slice(0, 1));

  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(
      nodeChildren.children || [],
      splitItemChildrenPath
    ),
  };

  return updatedChildren;
};

export const addChildToChildren = (
  children: LayoutItem[],
  splitDropZonePath: string[],
  item: LayoutItem
): LayoutItem[] => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children || [],
      splitItemChildrenPath,
      item
    ),
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout: LayoutItem[],
  splitDropZonePath: string[],
  splitItemPath: string[]
): LayoutItem[] => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToRow = (layout: LayoutItem[]): LayoutItem[] => {
  const layoutCopy = [...layout];
  const COLUMN_STRUCTURE: LayoutItem = {
    type: COLUMN,
    id: shortid.generate(),
    children: [],
  };

  return layoutCopy.map((row) => {
    if (!row.children || !row.children.length) {
      row.children = [COLUMN_STRUCTURE];
    }
    return row;
  });
};

export const handleMoveToDifferentParent = (
  layout: LayoutItem[],
  splitDropZonePath: string[],
  splitItemPath: string[],
  item: LayoutItem
): LayoutItem[] => {
  let newLayoutStructure: LayoutItem;
  const COLUMN_STRUCTURE: LayoutItem = {
    type: COLUMN,
    id: shortid.generate(),
    children: [item],
  };

  const ROW_STRUCTURE: LayoutItem = {
    type: ROW,
    id: shortid.generate(),
  };

  switch (splitDropZonePath.length) {
    case 1: {
      if (item.type === COLUMN) {
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [item],
        };
      } else {
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [COLUMN_STRUCTURE],
        };
      }
      break;
    }
    case 2: {
      if (item.type === COMPONENT) {
        newLayoutStructure = COLUMN_STRUCTURE;
      } else {
        newLayoutStructure = item;
      }
      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  let updatedLayout = layout;
  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout = handleAddColumDataToRow(updatedLayout);
  updatedLayout = addChildToChildren(
    updatedLayout,
    splitDropZonePath,
    newLayoutStructure
  );

  return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (
  layout: LayoutItem[],
  splitDropZonePath: string[],
  item: LayoutItem
): LayoutItem[] => {
  let newLayoutStructure: LayoutItem;
  switch (splitDropZonePath.length) {
    case 1: {
      newLayoutStructure = {
        type: ROW,
        id: shortid.generate(),
        children: [{ type: COLUMN, id: shortid.generate(), children: [item] }],
      };
      break;
    }
    case 2: {
      newLayoutStructure = {
        type: COLUMN,
        id: shortid.generate(),
        children: [item],
      };
      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (
  layout: LayoutItem[],
  splitItemPath: string[]
): LayoutItem[] => {
  return removeChildFromChildren(layout, splitItemPath);
};
