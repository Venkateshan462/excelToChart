export function buildDynamicOrgTree(data, hierarchyKeys) {
  const tree = {};

  data.forEach((item) => {
    let currentLevel = tree;

    hierarchyKeys.forEach((key) => {
      const keyValue = item[key];
      if (!keyValue) return;

      if (!currentLevel[keyValue]) {
        currentLevel[keyValue] = { name: keyValue, children: {} };
      }

      currentLevel = currentLevel[keyValue].children;
    });
  });

  function formatTree(obj) {
    return Object.values(obj).map((node) => ({
      name: node.name,
      children: formatTree(node.children),
      //   collapsed: false,
    }));
  }

  return formatTree(tree);
}

export const createJsonForChart = (rawData) => {
  const getHierarchyKeys = Object.keys(rawData[0]);

  const hierarchyKeys = getHierarchyKeys;

  const orgTree = buildDynamicOrgTree(rawData, hierarchyKeys);

  const treeData = {
    name: "Root",
    children: orgTree,
  };

  return treeData;
};
