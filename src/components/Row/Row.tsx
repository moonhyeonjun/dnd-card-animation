import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "constants/constants";
import { LayoutItem, GridProps } from "types";
import DropZone from "../DropZone/DropZone";
import Column from "../Column/Column";
import "./Row.css";

const Row: React.FC<GridProps> = ({ data, components, handleDrop, path }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    LayoutItem,
    void,
    { isDragging: boolean }
  >({
    type: ROW,
    item: {
      type: ROW,
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column: any, currentPath: string) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  return (
    <div ref={ref} style={{ opacity }} className="base draggable row">
      {data.id}
      <div className="columns">
        {data.children &&
          data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children ? data.children.length : 0,
                  }}
                  index={index}
                  onDrop={handleDrop}
                  className="horizontalDrag"
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          })}
        <DropZone
          data={{
            path: data.children && `${path}-${data.children.length}`,
            childrenCount: data.children ? data.children.length : 0,
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </div>
    </div>
  );
};

export default Row;
