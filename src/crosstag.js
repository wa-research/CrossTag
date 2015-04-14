// region: Useful array extensions
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    }
  });
}

// Used by 'directory.js' as well
Array.prototype.has = (
  !Array.indexOf ? function (o) {
    var l = this.length + 1;
    while (l -= 1) { if (this[l - 1] === o) { return true; } }
    return false;
  } : function (o) { return (this.indexOf(o) !== -1); }
);

Array.prototype.hasAny = function(o) {
    for (var i in o)
        if (this.has(i))
            return true;
    return false;
};

Array.prototype.matchesAll = function(funcs) {
    for (var f in funcs)
        if (!funcs[f](this))
            return false;
    return true;
}

Array.prototype.except = function(a) {
    return this.filter(function(el) { return a.indexOf(el) < 0; });
};
// endregion

var crosstag = function crosstag(list, tagsById) {
    var toggleTag = function(tag, selection, returnClone) {
        var cat = (t = tagsById[tag]) && t.group,
            sel = returnClone ? clone(selection) : selection;

        if (cat) {
            if (sel.hasOwnProperty(cat)) {
                var sc = sel[cat];
                if (sc.has(tag)) {
                    sc.splice(sc.indexOf(tag), 1);
                    if (sc.length == 0)
                        delete sel[cat];
                } else {
                    sc.push(tag);
                    sc.sort();
                }
            } else {
                sel[cat] = new Array(tag);
            }
        }

        return sel;
    };

    function createOrFilter(g, selection) {
        if (g) {
            var neg = g.charAt(0) == '~';
            // Convert selection format ({'grp':[tag1,tag2]}) into a lookup map {"tag1" :true, "tag2":true }
            var lookup = selection[g].reduce(function(acc, el) { 
                acc[el] = true; 
                return acc; }, {});
            // != acts as XNOR on booleans--thus modulating the outcome as hasAny or hasNone
            // A |  B | A xnor B
            // --+----+----------
            // T |  T |    T
            // T |  F |    F
            // F |  T |    F
            // F |  F |    T
            return function(t) { return t.hasAny(lookup) != neg; }
        }
    };

    function incr(key, o) {
        if (o.hasOwnProperty(key))
            o[key] += 1;
        else
            o[key] = 1;
    }
  
    var applySelection = function(selection) {
        var sk = Object.keys(selection);
        if (sk.length == 0)
            return list;

        var ffuncs = sk.reduce(function(acc, g) {
            acc[g] = createOrFilter(g, selection);
            return acc;
        }, {});

        return list.filter(function(el) {
            return el.tags.matchesAll(ffuncs);
        })
    };

    var tagLookupByGroup = function(lookup) {
        return Object.keys(lookup).reduce(function(acc, t) {
            var g = lookup[t].group;
            (acc[g] = acc[g] || {})[t] = true;
            return acc;
        }, {});
    };

    var countSelectable = function(selection) {
        var selCount = {},
            selection = selection || {},
            groups = Object.keys(selection),
            lookup = tagsByGroup;

        // Restrict each selected group with all elements of all other selected groups
        for (var sg in selection) {
            var newSel = groups.except(sg).reduce(function(s, el) { s[el] = selection[el]; return s; }, {});
            applySelection(newSel).forEach(function(el) {
                // Only count tags belonging to the currently examined group
                el.tags.forEach(function(t) { if (lookup[sg].hasOwnProperty(t)) incr(t, selCount); });
            });
        }

        return selCount;
    };

    var countSelected = function(selected) {
        return selected.reduce(function(acc, el) {
            el.tags.forEach(function(t) { incr(t, acc); });
            return acc;
        }, {});
    }

    var clone = function(selection) {
        return Object.keys(selection).reduce(function(acc, g) {
            acc[g] = selection[g].reduce(function(acc, el) { acc.push(el); return acc; }, []);

            return acc;
        }, {});
    };

    var tagsByGroup = tagLookupByGroup(tagsById);

    return {
        version : "1.0.0",
        applySelection      : applySelection,
        getList             : function() { return list; },
        toggleTag           : toggleTag,
        countSelected       : countSelected,
        countSelectable     : countSelectable
    };
}
