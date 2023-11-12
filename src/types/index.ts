export type ComponentType = {
  id: string;
  content?: string;
};

export interface LayoutItem {
  id: string;
  type: string;
  path?: string;
  index?: number;
  component?: ComponentType;
  children?: LayoutItem[];
}

export interface TrashItem {
  layout: any;
}

export interface DropItem {
  path?: string;
  childrenCount: number;
}

export interface GridProps {
  data: LayoutItem;
  components: Record<string, ComponentType>;
  handleDrop: (path: string, droppedItem: LayoutItem) => void;
  path: string;
}

export interface ComponentProps {
  data: ComponentType;
  components: Record<string, ComponentType>;
  path: string;
}

export interface DropZoneProps {
  data: DropItem;
  index?: number;
  onDrop: (dropZone: any, item: LayoutItem) => void;
  isLast?: boolean;
  path?: string;
  children?: LayoutItem[];
  className?: string;
}

export interface SideBarItemProps {
  data: {
    component: {
      type: string;
      content: string;
    };
  };
}

export interface TrashDropZoneProps {
  data: TrashItem;
  onDrop: (data: TrashItem, item: LayoutItem) => void;
}
