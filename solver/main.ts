import { CellBase, CellStr, toCellBase, Vec2 } from "./cell.ts";
import { generateTree, pruneTree } from "./tree.ts";

const viewNs = {
  shift: (view: CellStr[]) => {
    if (view.length === 0) {
      throw new Error("view is empty");
    }
    const head = view[0];
    const tail = view.slice(1);
    return { head, tail };
  },
};

// rootNodeを作成
const generateRoot = (str: CellStr): CellBase => {
  const _root = toCellBase(str);
  const vec2: Vec2 = { x: 0, y: 0 };
  const root: CellBase = {
    ..._root,
    depth: 0,
    vec2,
    path: [{ type: str, vec2 }],
  };
  return root;
};

const main = () => {
  // const VIEW: CellStr[] = ["2LT", "2RB", "3TRB"];
  const VIEW: CellStr[] = ["2TB", "2TB"] as const;

  const { head: headStr, tail: rootlessView } = viewNs.shift(VIEW);
  const root = generateRoot(headStr);

  const tree = generateTree(root, rootlessView);

  const prunedTree = pruneTree(tree, VIEW);

  console.log(JSON.stringify(prunedTree, null, 2));

  // TODO: Cellが重なったら、そのpathは削除
  // VIEW.length >= 5 以上で発生
};

if (import.meta.main) {
  main();
}
