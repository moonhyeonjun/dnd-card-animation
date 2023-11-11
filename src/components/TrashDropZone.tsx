import React from "react";
import classNames from "classnames";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { COMPONENT, ROW, COLUMN } from "constants/constants";
import { TrashDropZoneProps } from "types";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

const TrashDropZone: React.FC<TrashDropZoneProps> = ({ data, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item: any, monitor: DropTargetMonitor) => {
      onDrop(data, item);
    },
    canDrop: (item: any, monitor: DropTargetMonitor) => {
      const layout = data.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // 열이 1개뿐일 때 열을 제거하는 것을 방지
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
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
      className={classNames("trashDropZone", { active: isActive })}
      ref={drop}
    >
      TRASH
    </div>
  );
};

export default TrashDropZone;
