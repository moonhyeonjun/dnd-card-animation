import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "constants/constants";
import { ComponentType, LayoutItem, GridProps } from "types";
import DropZone from "./DropZone";
import Component from "./Component";

const style: React.CSSProperties = {};
const Column: React.FC<GridProps> = ({
  data,
  components,
  handleDrop,
  path,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    LayoutItem,
    void,
    { isDragging: boolean }
  >({
    type: COLUMN,
    item: {
      type: COLUMN,
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

  const renderComponent = (component: ComponentType, currentPath: string) => {
    return (
      <Component
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
      />
    );
  };

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column"
    >
      {data.id}
      {data.children &&
        data.children.map((component, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={component.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children ? data.children.length : 0,
                }}
                index={index}
                onDrop={handleDrop}
              />
              {renderComponent(component, currentPath)}
            </React.Fragment>
          );
        })}
      <DropZone
        data={{
          path: data.children && `${path}-${data.children.length}`,
          childrenCount: data.children ? data.children.length : 0,
        }}
        onDrop={handleDrop}
        isLast
      />
    </div>
  );
};

export default Column;
