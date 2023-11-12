import React, { useState, useCallback } from "react";
import DropZone from "components/DropZone/DropZone";
import TrashDropZone from "components/TrashDropZone/TrashDropZone";
import SideBarItem from "components/SideBarItem/SideBarItem";
import Row from "components/Row/Row";
import initialData from "data/initial-data";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "hooks/helpers";
import {
  SIDEBAR_ITEMS,
  SIDEBAR_ITEM,
  COMPONENT,
  COLUMN,
} from "constants/constants";
import { ComponentType, LayoutItem } from "types";
import shortid from "shortid";
import "./DndCard.css";

const DndCardPage: React.FC = () => {
  const initialLayout: LayoutItem[] = initialData.layout;
  const initialComponents: Record<string, ComponentType> =
    initialData.components;
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);
  const [components, setComponents] =
    useState<Record<string, ComponentType>>(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone: any, item: LayoutItem) => {
      if (!item.path) return;
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone: any, item: LayoutItem) => {
      console.log("dropZone", dropZone);
      console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem: LayoutItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // 사이드바 항목의 경우
      if (item.type === SIDEBAR_ITEM) {
        // 1. 사이드바 항목을 페이지로 이동
        const newComponent: ComponentType = {
          id: shortid.generate(),
          ...item.component,
        };
        const newLayoutItem: LayoutItem = {
          id: newComponent.id,
          type: COMPONENT,
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newLayoutItem
          )
        );
        return;
      }

      if (!item.path) return;
      // 사이드바 항목에 경로가 없으므로 아래로 이동
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. 이동(생성 X)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. 부모안에서 이동
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. 또는 다른 부모로 이동
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. 이동 + 생성
      // setLayout(
      //   handleMoveToDifferentParent(
      //     layout,
      //     splitDropZonePath,
      //     splitItemPath,
      //     newItem
      //   )
      // );
    },
    [layout, components]
  );

  const renderRow = (row: LayoutItem, currentPath: string) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };

  // 항목을 매핑할 때 키에 인덱스 사용 안 함
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="sideBar">
        {Object.values(SIDEBAR_ITEMS).map((sideBarItem) => (
          <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  index={index}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>
      </div>
    </div>
  );
};

export default DndCardPage;
