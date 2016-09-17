# CrossTag

Given a set of tags and a list of tagged objects, filters the list based on a combination of selected tags.

## API Reference

All functionality is available in the `crosstag` namespace.

### `crosstag( tagged_list, tagset )` 

Creates a new crosstag application. Each crosstag is associated with a list and has a tag set used to filter the list.

The list is an array of objects with an `id` and an array of tag IDs, corresponding to the object keys in the tag set:

    var list = [
        {"id":"1" ,"tags":["1"]},
        {"id":"2" ,"tags":["1", "2"]},
        {"id":"3" ,"tags":["1", "2", "3"]},
        {"id":"5" ,"tags":["1", "6"]},

Tags are organized in groups, each group representing a facet of the tagged objects. The tag set passed to the constructor is an object keyed by tag ID, and containing the group name. 

    {
        "tag_id_1" : {"group":"Group ID"},
        "tag_id_2" : {"group":"Group ID"}
    }

Integers don't make good object keys, hence the tag IDs should be strings, even if they are integers in the database. 

### `applySelection( selection_object )`

The selection object contains a list of tag groups, each containing an array of keys:

    { "A":[1,2,3], "B":[4,5,6] }

The function builds a set of rules to match all items that are within a group, and only those that are in all groups. Thus, an OR function for tags within each tag group (that is, the function will evaluate if any of the tags in the selection are present on the item, calling `hasAny`), and then an AND operation between all those OR functions.

The output of `applySelection` is an object containing all items from each group in the `tagged_list` that matches all selection criteria.

If the group name starts with `~`, then the selection will be negated (thus, calling `!hasAny`). This way we can look for items not tagged with a specific tag.

For example, (`{"~":[1]}`) will find items not tagged with tag `1`. To find items not tagged with a specific facet, negate all tags from that group: `{"~":[1,2,3,4,5]}` (assuming the group consists of those five tags).

### `countSelected( selection )`

Returns the object indicating how many items for each tag are selected, so that the UI can show this information to the user in the tag selector list.

### `countSelectable( selection )`

Crosstag can give information to the user about which other items are _potentially selectable_: that is, when a selection is made, which other items that are currently not selected can still be selected and return meaningful results.


