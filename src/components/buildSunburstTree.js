function buildSunburstTree(data, hierarchyKeys) {
  let root = { name: "Root", children: [] };

  data.forEach((item) => {
    let currentLevel = root;

    hierarchyKeys.forEach((key) => {
      const keyValue = item[key];
      if (!keyValue) return;

      // Check if child node already exists
      let existingNode = currentLevel.children.find(
        (child) => child.name === keyValue
      );

      if (!existingNode) {
        existingNode = { name: keyValue, children: [] };
        currentLevel.children.push(existingNode);
      }

      // Move deeper into the tree
      currentLevel = existingNode;
    });
  });

  // Recursively remove empty children arrays
  function cleanTree(node) {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      node.children.forEach(cleanTree);
    }
  }

  cleanTree(root);
  return root;
}

export const createJsonForSunburst = (rawData) => {
  console.log("rawData", rawData);
  if (!rawData.data.length) return { name: "Root", children: [] };

  const hierarchyKeys = Object.keys(rawData.data[0]);
  const treeData = buildSunburstTree(rawData.data, hierarchyKeys);

  return treeData;
};
