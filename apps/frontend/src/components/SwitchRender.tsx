import { Children, isValidElement, ReactNode } from "react";

export const Case = ({
  condition,
  children,
}: {
  condition: boolean;
  children: ReactNode;
}) => {
  return condition ? children : null;
};

export const Default = ({ children }: { children: ReactNode }) => {
  return children;
};

export const SwitchRender = ({ children }: { children: ReactNode }) => {
  let matchChild: ReactNode | null = null;
  let defaultCase: ReactNode | null = null;
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (!matchChild && child.type === Case) {
        const { condition } = child.props as { condition: boolean };
        const conditionResult = Boolean(condition);
        if (conditionResult) {
          matchChild = child;
        }
      } else if (!defaultCase && child.type === Default) {
        defaultCase = child;
      }
    }
  });

  return matchChild ?? defaultCase ?? null;
};
