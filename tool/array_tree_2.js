// Data
var arr = [{
    "name": "root",
    "_id": "root_id",
}, {
    "name": "a2",
    "parentAreaRef": {
        "id": "a1_id",
    },
    "_id": "a2_id",
}, {
    "name": "a3",
    "parentAreaRef": {
        "id": "a2_id",
    },
    "_id": "a3_id",
}, {
    "name": "b1",
    "parentAreaRef": {
        "id": "root_id",
    },
    "_id": "b1_id",
}, {
    "name": "b2",
    "parentAreaRef": {
        "id": "b1_id",
    },
    "_id": "b2_id",
}, {
    "name": "b3",
    "parentAreaRef": {
        "id": "b1_id",
    },
    "_id": "b3_id",
}, {
    "name": "a1",
    "parentAreaRef": {
        "id": "root_id",
    },
    "_id": "a1_id",
}];

// Define root
var root = {
    name: "root",
    _id: "root_id",
    children: []
}

// Define tree
var tree = {
    root: root
};

// Get parent of node (recursive)
var getParent = function(rootNode, rootId) {

    if (rootNode._id === rootId)
        return rootNode;

    for (var i = 0; i < rootNode.children.length; i++) {
        var child = rootNode.children[i];
        if (child._id === rootId) return child;

        if (child.children.length > 0)
            var childResult = getParent(child, rootId);

        if (childResult != null) return childResult;
    }
    return null;
};

// Traverse data and build the tree
var buildTree = function(tree) {
    for (var i = 0; i < arr.length; i++) {
        var elem = arr[i];
        if (elem.name === "root")
            continue;
        elem["children"] = [];

        var rootId = elem.parentAreaRef.id;
        var parent = getParent(tree.root, rootId);

        parent.children.push(elem);

        // Debug info
        console.log("Elem: " + elem.name + " with parent_id: " + elem.parentAreaRef.id);
        console.log("Got parent with name: " + parent._id);
    }
};

// Print the tree
var htmlStr = "";
var printTree = function(node) {
    console.log(node);
    htmlStr = htmlStr + "<ul>";
    htmlStr = htmlStr + "<li>";
    htmlStr = htmlStr + node.name;
    htmlStr = htmlStr + "</li>";
    for (var i = 0; i < node.children.length; i++)
        printTree(node.children[i], htmlStr);
    htmlStr = htmlStr + "</ul>";
    return htmlStr;
}

// I have not handled scope and pretty print that well, but the implementation shows the concept of an implementation
buildTree(tree);
printTree(tree.root);
console.log(htmlStr);
