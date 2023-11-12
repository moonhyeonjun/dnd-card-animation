import React from "react";
import classNames from "classnames";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { COMPONENT, SIDEBAR_ITEM, ROW, COLUMN } from "constants/constants";
import { LayoutItem, DropZoneProps } from "types";
import "./DropZone.css";

const ACCEPTS = [SIDEBAR_ITEM, COMPONENT, ROW, COLUMN];

const DropZone: React.FC<DropZoneProps> = ({
  data,
  index,
  onDrop,
  isLast,
  className,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item: LayoutItem, monitor: DropTargetMonitor) => {
      onDrop(data, item);
    },
    canDrop: (item: LayoutItem, monitor: DropTargetMonitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath ? dropZonePath.split("-") : [];
      const itemPath = item.path;

      // 사이드바 항목은 어느 곳에나 드롭 가능
      if (!itemPath) {
        // 한 행에 최대 열 제한
        const limitDropItemCounts = 6;
        if (data.childrenCount >= limitDropItemCounts) return false;
        return true;
      }

      const splitItemPath = itemPath.split("-");

      // 한 행에서 다른 행으로 끌 때 열 제한
      const dropZonePathRowIndex = splitDropZonePath[0];
      const itemPathRowIndex = splitItemPath[0];
      const diffRow = dropZonePathRowIndex !== itemPathRowIndex;
      if (
        diffRow &&
        splitDropZonePath.length === 2 &&
        data.childrenCount >= 3
      ) {
        return false;
      }

      // 부모 요소(행)을 자식(열)에 놓을 수 없음
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
      if (parentDropInChild) return false;

      // 현재 항목을 자신의 위치로 이동할 수 없습니다
      if (itemPath === dropZonePath) return false;

      // 현재 영역
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames(
        "dropZone",
        { active: isActive, isLast },
        className
      )}
      ref={drop}
    />
  );
};
export default DropZone;
