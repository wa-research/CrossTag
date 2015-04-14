# CrossTag

A tag-base filtering library. Given a set of tags and a list of tagged objects, it filters the list based on a combination of selected tags.

## API Reference

All functionality is available in the `crosstag` namespace.

### `crosstag()` Constructor

Creates a new crosstag application. Each crosstag is associated with a list and has a tagset used to filter the list.


### `applySelection( selection_object )`

The selection object contains a list of tag groups, each containing an array of keys:

    { "A":[1,2,3], "B":[4,5,6] }

The function builds a set of rules to match all items that are within a group, and only those that are in all groups. Thus, an OR function for tags within each tag group (that is, the function will evaluate if any of the tags in the selection are present on the item, calling `hasAny`), and then an AND operation between all those OR functions.

If the group name starts with `~`, then the selection will be negated (thus, calling `!hasAny`). This way we can look for items not tagged with a specific tag (`{"~":[1]}`), or items not in the group: (`{"~":[1,2,3,4,5]}`, assuming the group consists of those five ids).
