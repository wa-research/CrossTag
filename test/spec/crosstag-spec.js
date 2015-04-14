describe("Crosstag tests", function() {
    var tags = { 
        "1":  {"id": 1 ,"title":"Tag1",  "group": "A" },
        "2":  {"id": 2 ,"title":"Tag2",  "group": "A" },
        "3":  {"id": 3 ,"title":"Tag3",  "group": "A" },
        "4":  {"id": 4 ,"title":"Tag4",  "group": "A" },
        "5":  {"id": 5 ,"title":"Tag5",  "group": "A" },

        "6":  {"id": 6 ,"title":"Tag6",  "group": "B" },
        "7":  {"id": 7 ,"title":"Tag7",  "group": "B" },
        "8":  {"id": 8 ,"title":"Tag8",  "group": "B" },
        "9":  {"id": 9 ,"title":"Tag9",  "group": "B" },
       "10":  {"id":10 ,"title":"Tag10", "group": "B" },
    } ;
    // Tag counts:
    //
    // tag   |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10
    // ------+----+----+----+----+----+----+----+----+----+----
    // count |  8 |  3 |  2 |  1 |  0 |  2 |  2 |  2 |  2 |  1 
    // 
    // Items not tagged with
    // grp A: 5
    // grp B: 4
    //
    // Items tagged with both groups: 4
    var list = [
        {"id":"1" ,"tags":["1"]},                   // Not in B
        {"id":"2" ,"tags":["1", "2"]},              // Not in B
        {"id":"3" ,"tags":["1", "2", "3"]},         // Not in B
        {"id":"4" ,"tags":["1", "2", "3", "4"]},    // Not in B
        {"id":"5" ,"tags":["1", "6"]},
        {"id":"6" ,"tags":["1", "7"]},
        {"id":"7" ,"tags":["1", "8"]},
        {"id":"8" ,"tags":["1", "9"]},
        {"id":"9" ,"tags":["6"]},                   // Not in A
        {"id":"10","tags":["7"]},                   // Not in A
        {"id":"11","tags":["8"]},                   // Not in A
        {"id":"12","tags":["9"]},                   // Not in A
        {"id":"13","tags":["10"]}                   // Not in A
    ];

    var xt;

    beforeEach(function() {
        xt = new crosstag(list, tags);
    });

    describe("Constructor", function() {
        it("should crate a new crosstag", function() {
            expect(xt).not.toBeNull();
        });

        it("should keep the list passed in", function() {
            expect(xt.getList()).toEqual(list);
        });

        it("should create tag lookup by id", function() {
            expect(tags.tagLookupById).not.toBeNull();
        });
    });

    describe("Selection", function() {
        it("should return the whole list when selection is empty", function() {
            expect(xt.applySelection({})).toEqual(list);
        });

        it("should filter the list when selection is not empty", function() {
            var sel = xt.applySelection({ "A":["1"] });
            expect(sel.length).toEqual(8);
        });

        it("should return non-zero counts when the selection is not empty", function() {
            var sel = xt.applySelection({ "A":["1"] });
            expect(xt.countSelected(sel)).toEqual({ 1: 8, 2: 3, 3: 2, 4: 1, 6: 1, 7: 1, 8: 1, 9: 1 });
        });

        it("should return a disjunct set when tags from two groups are applied", function(){
            var sel = xt.applySelection({ "A":["1"], "B":["6"] });
            expect(xt.countSelected(sel)).toEqual({ 1: 1, 6: 1 });
        });

    });

    describe("Inverted selection", function() {
        it("Should return five items not tagged with A", function() {
            var sel = xt.applySelection({ "~":["1","2","3","4","5"] });
            expect(sel.length).toEqual(5);
        });
        it("Should return four items not tagged with B", function() {
            var sel = xt.applySelection({ "~":["6","7","8","9","10"] });
            expect(sel.length).toEqual(4);
        });
        it("Should return items tagged with tag 1, but not with tag 2", function() {
            var sel = xt.applySelection({ "~":["2"], "A":["1"] });
            expect(sel.length).toEqual(5);
        });
    });
});
