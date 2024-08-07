import { CellBase, CellStr, toCellBase, VecCell } from "./cell.ts";
import { addVecCell, Board } from "./board.ts";

const NULL_NEXT = {
  top: null,
  right: null,
  bottom: null,
  left: null,
} as const;

const generateTree = (root: CellBase, rootlessView: CellStr[]): CellBase => {
  const clonedRoot = structuredClone(root);
  let parents: CellBase[] = [clonedRoot];

  const rootlessViewLength = rootlessView.length;

  for (let i = 0; i < rootlessViewLength; i++) {
    const child = toCellBase(rootlessView[i]);

    const nextParents: CellBase[] = [];

    for (const parent of parents) {
      // undefined: その方向にマスを置ける可能性がある
      // 上方向に連結
      if (parent.next.top === undefined) {
        if (child.next.bottom === undefined) {
          const cloned = structuredClone(child);

          // parent を置いたので、もうその方向は null
          cloned.next.bottom = null;
          // 最後のマスは、next が全部 null
          if (i === rootlessViewLength - 1) {
            cloned.leaf = true;
            cloned.next = {
              ...NULL_NEXT,
              identical: cloned.next.identical,
            };
          }
          cloned.depth = i + 1;
          cloned.vec2 = { x: parent.vec2.x, y: parent.vec2.y - 1 };
          cloned.path = [...parent.path, {
            type: child.type,
            vec2: cloned.vec2,
          }];

          parent.next.top = cloned;
          nextParents.push(cloned);
        } else {
          parent.next.top = null;
        }
      }
      // 右方向に連結
      if (parent.next.right === undefined) {
        if (child.next.left === undefined) {
          const cloned = structuredClone(child);

          cloned.next.left = null;
          if (i === rootlessViewLength - 1) {
            cloned.leaf = true;
            cloned.next = {
              ...NULL_NEXT,
              identical: cloned.next.identical,
            };
          }
          cloned.depth = i + 1;
          cloned.vec2 = { x: parent.vec2.x + 1, y: parent.vec2.y };
          cloned.path = [...parent.path, {
            type: child.type,
            vec2: cloned.vec2,
          }];

          parent.next.right = cloned;
          nextParents.push(cloned);
        } else {
          parent.next.right = null;
        }
      }
      // 下方向に連結
      if (parent.next.bottom === undefined) {
        if (child.next.top === undefined) {
          const cloned = structuredClone(child);

          cloned.next.top = null;
          if (i === rootlessViewLength - 1) {
            cloned.leaf = true;
            cloned.next = {
              ...NULL_NEXT,
              identical: cloned.next.identical,
            };
          }
          cloned.depth = i + 1;
          cloned.vec2 = { x: parent.vec2.x, y: parent.vec2.y + 1 };
          cloned.path = [...parent.path, {
            type: child.type,
            vec2: cloned.vec2,
          }];

          parent.next.bottom = cloned;
          nextParents.push(cloned);
        } else {
          parent.next.bottom = null;
        }
      }
      // 左方向に連結
      if (parent.next.left === undefined) {
        if (child.next.right === undefined) {
          const cloned = structuredClone(child);

          cloned.next.right = null;
          if (i === rootlessViewLength - 1) {
            cloned.leaf = true;
            cloned.next = {
              ...NULL_NEXT,
              identical: cloned.next.identical,
            };
          }
          cloned.depth = i + 1;
          cloned.vec2 = { x: parent.vec2.x - 1, y: parent.vec2.y };
          cloned.path = [...parent.path, {
            type: child.type,
            vec2: cloned.vec2,
          }];

          parent.next.left = cloned;
          nextParents.push(cloned);
        } else {
          parent.next.left = null;
        }
      }

      // identical
      if (
        parent.type === child.type &&
        [
          parent.next.top,
          parent.next.right,
          parent.next.bottom,
          parent.next.left,
        ].some((v) => v === null)
      ) {
        const cloned = structuredClone(parent);
        cloned.depth = i + 1;
        cloned.vec2 = { x: parent.vec2.x, y: parent.vec2.y };
        cloned.path = [...parent.path, {
          type: child.type,
          vec2: cloned.vec2,
        }];

        // 最後のマスは、next が全部 null
        if (i === rootlessViewLength - 1) {
          cloned.leaf = true;
          cloned.next = {
            ...NULL_NEXT,
            identical: cloned.next.identical,
          };
        }

        parent.next.identical = cloned;
      }
    }

    if (i < rootlessView.length - 1) {
      parents = nextParents;
    }
  }

  return clonedRoot;
};

const isLeaf = (cell: CellBase) => {
  return (
    [cell.next.top, cell.next.right, cell.next.bottom, cell.next.left].every((
      v,
    ) => v === null)
  );
};

// leaf (next 4つが全部 null) をカット
// ただし、最後の leaf は残す
const pruneUnnecessaryLeaves = (
  tree: CellBase,
  fullView: CellStr[],
): CellBase | null => {
  const clonedTree = structuredClone(tree);
  // 一旦、rootだけ
  if (isLeaf(clonedTree)) {
    return null;
  }

  // rootより下
  let grandParents = [clonedTree];
  for (let i = 0; i < fullView.length - 2; i++) {
    for (const grandParent of grandParents) {
      let parent = grandParent.next.top;
      if (parent !== null && parent !== undefined) {
        if (isLeaf(parent)) {
          // ↓ parent を削除
          grandParent.next.top = null;
        }
      }

      parent = grandParent.next.right;
      if (parent !== null && parent !== undefined) {
        if (isLeaf(parent)) {
          // ↓ parent を削除
          grandParent.next.right = null;
        }
      }

      parent = grandParent.next.bottom;
      if (parent !== null && parent !== undefined) {
        if (isLeaf(parent)) {
          // ↓ parent を削除
          grandParent.next.bottom = null;
        }
      }

      parent = grandParent.next.left;
      if (parent !== null && parent !== undefined) {
        if (isLeaf(parent)) {
          // ↓ parent を削除
          grandParent.next.left = null;
        }
      }
    }
    const nextGrandParents = [];
    for (const grandParent of grandParents) {
      if (grandParent.next.top !== null && grandParent.next.top !== undefined) {
        nextGrandParents.push(grandParent.next.top);
      }
      if (
        grandParent.next.right !== null && grandParent.next.right !== undefined
      ) {
        nextGrandParents.push(grandParent.next.right);
      }
      if (
        grandParent.next.bottom !== null &&
        grandParent.next.bottom !== undefined
      ) {
        nextGrandParents.push(grandParent.next.bottom);
      }
      if (
        grandParent.next.left !== null && grandParent.next.left !== undefined
      ) {
        nextGrandParents.push(grandParent.next.left);
      }
    }
    grandParents = nextGrandParents;
  }
  return clonedTree;
};

// 不要な node を削除
const pruneTree = (tree: CellBase, fullView: CellStr[]): CellBase | null => {
  // TODO: board に変換できるかを check して、できない node は削除
  let clonedTree: CellBase | null = structuredClone(tree);
  for (let i = 0; i < fullView.length - 1; i++) {
    const pruned = pruneUnnecessaryLeaves(clonedTree, fullView);
    if (pruned === null) {
      return null;
    }
    clonedTree = pruned;
  }
  return clonedTree;
};

export { generateTree, pruneTree, pruneUnnecessaryLeaves };
