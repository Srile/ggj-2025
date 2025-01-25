export function setHierarchyActive(object, b) {
    object.active = b;
    const children = object.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        setHierarchyActive(child, b);
    }
}