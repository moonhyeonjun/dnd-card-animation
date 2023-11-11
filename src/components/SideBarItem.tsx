import React from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { SIDEBAR_ITEM } from "constants/constants";
import { SideBarItemProps } from "types";

const SideBarItem: React.FC<SideBarItemProps> = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    type: SIDEBAR_ITEM,
    item: data,
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.component.type}
    </div>
  );
};

export default SideBarItem;
