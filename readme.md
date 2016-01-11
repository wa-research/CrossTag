# CrossTag

A tag-base filtering library. Given a set of tags and a list of tagged objects, it filters the list based on a combination of selected tags.

## API Reference

All functionality is available in the `crosstag` namespace.

### `crosstag(tagged_list, tagset)` Constructor

Creates a new crosstag application. Each crosstag is associated with a list and has a tagset used to filter the list.

The list is an array of object that at minimum contain keys `id` and `tags`, which in turn is an array of tag IDs, corresponding to the 
object keys in the tagset:

    var list = [
        {"id":"1" ,"tags":["1"]},
        {"id":"2" ,"tags":["1", "2"]},
        {"id":"3" ,"tags":["1", "2", "3"]},
        {"id":"5" ,"tags":["1", "6"]},

The tag set passed to the constructor is an object keyed by tag ID, and containing the group name. Integers don't make good object keys, 
hence the tag IDs should be strings, even if they are integers in the database. The group ID is needed to simplify selecting items belonging
a group, or those that are not tagged with a specific group. 

    {
        "tag_id_1" : {"group":"Group ID"},
        "tag_id_2" : {"group":"Group ID"}
    }

### `applySelection( selection_object )`

The selection object contains a list of tag groups, each containing an array of keys:

    { "A":[1,2,3], "B":[4,5,6] }

The function builds a set of rules to match all items that are within a group, and only those that are in all groups. Thus, an OR function for tags within each tag group (that is, the function will evaluate if any of the tags in the selection are present on the item, calling `hasAny`), and then an AND operation between all those OR functions.

If the group name starts with `~`, then the selection will be negated (thus, calling `!hasAny`). This way we can look for items not tagged with a specific tag (`{"~":[1]}`), or items not in the group: (`{"~":[1,2,3,4,5]}`, assuming the group consists of those five ids).

The output of `applySelection` is an object containing all items from each group in the tagged_list that matches all selection criteria.

### `countSelected( selection )`

Once the selection is made, the count selected function returns the object indicating how many items for each tag are selected, so that the UI can show this information to the user in the tag selector list.

### `countSelectable( selection )`

Crosstag can give information to the user about which other items are _potentially selectable_: that is, when a selection is made, which other items that are currently not selected can still be selected and return meaningful results.


