// This is a prelude which comes before the JS blob of each JS type for the web.
(function(){
  var module = {exports:{}};
  var exports = module.exports;

// Generated by CoffeeScript 1.6.2
exports._bootstrapTransform = function(type, transformComponent, checkValidOp, append) {
  var transformComponentX, transformX;

  transformComponentX = function(left, right, destLeft, destRight) {
    transformComponent(destLeft, left, right, 'left');
    return transformComponent(destRight, right, left, 'right');
  };
  type.transformX = type.transformX = transformX = function(leftOp, rightOp) {
    var k, l, l_, newLeftOp, newRightOp, nextC, r, r_, rightComponent, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;

    checkValidOp(leftOp);
    checkValidOp(rightOp);
    newRightOp = [];
    for (_i = 0, _len = rightOp.length; _i < _len; _i++) {
      rightComponent = rightOp[_i];
      newLeftOp = [];
      k = 0;
      while (k < leftOp.length) {
        nextC = [];
        transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
        k++;
        if (nextC.length === 1) {
          rightComponent = nextC[0];
        } else if (nextC.length === 0) {
          _ref = leftOp.slice(k);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            l = _ref[_j];
            append(newLeftOp, l);
          }
          rightComponent = null;
          break;
        } else {
          _ref1 = transformX(leftOp.slice(k), nextC), l_ = _ref1[0], r_ = _ref1[1];
          for (_k = 0, _len2 = l_.length; _k < _len2; _k++) {
            l = l_[_k];
            append(newLeftOp, l);
          }
          for (_l = 0, _len3 = r_.length; _l < _len3; _l++) {
            r = r_[_l];
            append(newRightOp, r);
          }
          rightComponent = null;
          break;
        }
      }
      if (rightComponent != null) {
        append(newRightOp, rightComponent);
      }
      leftOp = newLeftOp;
    }
    return [leftOp, newRightOp];
  };
  return type.transform = type['transform'] = function(op, otherOp, type) {
    if (!(type === 'left' || type === 'right')) {
      throw new Error("type must be 'left' or 'right'");
    }
    if (otherOp.length === 0) {
      return op;
    }
    if (op.length === 1 && otherOp.length === 1) {
      return transformComponent([], op[0], otherOp[0], type);
    }
    if (type === 'left') {
      return transformX(op, otherOp)[0];
    } else {
      return transformX(otherOp, op)[1];
    }
  };
};
// Generated by CoffeeScript 1.6.2
var append, checkValidComponent, checkValidOp, invertComponent, strInject, text, transformComponent, transformPosition;

text = {
  name: 'text-old',
  uri: 'http://sharejs.org/types/textv0',
  create: function() {
    return '';
  }
};

strInject = function(s1, pos, s2) {
  return s1.slice(0, pos) + s2 + s1.slice(pos);
};

checkValidComponent = function(c) {
  var d_type, i_type;

  if (typeof c.p !== 'number') {
    throw new Error('component missing position field');
  }
  i_type = typeof c.i;
  d_type = typeof c.d;
  if (!((i_type === 'string') ^ (d_type === 'string'))) {
    throw new Error('component needs an i or d field');
  }
  if (!(c.p >= 0)) {
    throw new Error('position cannot be negative');
  }
};

checkValidOp = function(op) {
  var c, _i, _len;

  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    checkValidComponent(c);
  }
  return true;
};

text.apply = function(snapshot, op) {
  var component, deleted, _i, _len;

  checkValidOp(op);
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    component = op[_i];
    if (component.i != null) {
      snapshot = strInject(snapshot, component.p, component.i);
    } else {
      deleted = snapshot.slice(component.p, component.p + component.d.length);
      if (component.d !== deleted) {
        throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");
      }
      snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
    }
  }
  return snapshot;
};

text._append = append = function(newOp, c) {
  var last, _ref, _ref1;

  if (c.i === '' || c.d === '') {
    return;
  }
  if (newOp.length === 0) {
    return newOp.push(c);
  } else {
    last = newOp[newOp.length - 1];
    if ((last.i != null) && (c.i != null) && (last.p <= (_ref = c.p) && _ref <= (last.p + last.i.length))) {
      return newOp[newOp.length - 1] = {
        i: strInject(last.i, c.p - last.p, c.i),
        p: last.p
      };
    } else if ((last.d != null) && (c.d != null) && (c.p <= (_ref1 = last.p) && _ref1 <= (c.p + c.d.length))) {
      return newOp[newOp.length - 1] = {
        d: strInject(c.d, last.p - c.p, last.d),
        p: c.p
      };
    } else {
      return newOp.push(c);
    }
  }
};

text.compose = function(op1, op2) {
  var c, newOp, _i, _len;

  checkValidOp(op1);
  checkValidOp(op2);
  newOp = op1.slice();
  for (_i = 0, _len = op2.length; _i < _len; _i++) {
    c = op2[_i];
    append(newOp, c);
  }
  return newOp;
};

text.compress = function(op) {
  return text.compose([], op);
};

text.normalize = function(op) {
  var c, newOp, _i, _len, _ref;

  newOp = [];
  if ((op.i != null) || (op.p != null)) {
    op = [op];
  }
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    if ((_ref = c.p) == null) {
      c.p = 0;
    }
    append(newOp, c);
  }
  return newOp;
};

transformPosition = function(pos, c, insertAfter) {
  if (c.i != null) {
    if (c.p < pos || (c.p === pos && insertAfter)) {
      return pos + c.i.length;
    } else {
      return pos;
    }
  } else {
    if (pos <= c.p) {
      return pos;
    } else if (pos <= c.p + c.d.length) {
      return c.p;
    } else {
      return pos - c.d.length;
    }
  }
};

text.transformCursor = function(position, op, side) {
  var c, insertAfter, _i, _len;

  insertAfter = side === 'right';
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    position = transformPosition(position, c, insertAfter);
  }
  return position;
};

text._tc = transformComponent = function(dest, c, otherC, side) {
  var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;

  checkValidOp([c]);
  checkValidOp([otherC]);
  if (c.i != null) {
    append(dest, {
      i: c.i,
      p: transformPosition(c.p, otherC, side === 'right')
    });
  } else {
    if (otherC.i != null) {
      s = c.d;
      if (c.p < otherC.p) {
        append(dest, {
          d: s.slice(0, otherC.p - c.p),
          p: c.p
        });
        s = s.slice(otherC.p - c.p);
      }
      if (s !== '') {
        append(dest, {
          d: s,
          p: c.p + otherC.i.length
        });
      }
    } else {
      if (c.p >= otherC.p + otherC.d.length) {
        append(dest, {
          d: c.d,
          p: c.p - otherC.d.length
        });
      } else if (c.p + c.d.length <= otherC.p) {
        append(dest, c);
      } else {
        newC = {
          d: '',
          p: c.p
        };
        if (c.p < otherC.p) {
          newC.d = c.d.slice(0, otherC.p - c.p);
        }
        if (c.p + c.d.length > otherC.p + otherC.d.length) {
          newC.d += c.d.slice(otherC.p + otherC.d.length - c.p);
        }
        intersectStart = Math.max(c.p, otherC.p);
        intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
        cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
        otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
        if (cIntersect !== otherIntersect) {
          throw new Error('Delete ops delete different text in the same region of the document');
        }
        if (newC.d !== '') {
          newC.p = transformPosition(newC.p, otherC);
          append(dest, newC);
        }
      }
    }
  }
  return dest;
};

invertComponent = function(c) {
  if (c.i != null) {
    return {
      d: c.i,
      p: c.p
    };
  } else {
    return {
      i: c.d,
      p: c.p
    };
  }
};

text.invert = function(op) {
  var c, _i, _len, _ref, _results;

  _ref = op.slice().reverse();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    _results.push(invertComponent(c));
  }
  return _results;
};

if (typeof window !== "undefined" && window !== null) {
  exports._bootstrapTransform(text, text.transformComponent, text.checkValidOp, text.append);
} else {
  require('./helpers')._bootstrapTransform(text, text.transformComponent, text.checkValidOp, text.append);
}

module.exports = text;
// Generated by CoffeeScript 1.6.2
var clone, isArray, json, text;

if (typeof window !== "undefined" && window !== null) {
  text = module.exports;
} else {
  text = require('./text-old');
}

json = {
  name: 'json0',
  uri: 'http://sharejs.org/types/JSONv0'
};

json.create = function() {
  return null;
};

json.invertComponent = function(c) {
  var c_;

  c_ = {
    p: c.p
  };
  if (c.si !== void 0) {
    c_.sd = c.si;
  }
  if (c.sd !== void 0) {
    c_.si = c.sd;
  }
  if (c.oi !== void 0) {
    c_.od = c.oi;
  }
  if (c.od !== void 0) {
    c_.oi = c.od;
  }
  if (c.li !== void 0) {
    c_.ld = c.li;
  }
  if (c.ld !== void 0) {
    c_.li = c.ld;
  }
  if (c.na !== void 0) {
    c_.na = -c.na;
  }
  if (c.lm !== void 0) {
    c_.lm = c.p[c.p.length - 1];
    c_.p = c.p.slice(0, c.p.length - 1).concat([c.lm]);
  }
  return c_;
};

json.invert = function(op) {
  var c, _i, _len, _ref, _results;

  _ref = op.slice().reverse();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    _results.push(json.invertComponent(c));
  }
  return _results;
};

json.checkValidOp = function(op) {};

isArray = function(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
};

json.checkList = function(elem) {
  if (!isArray(elem)) {
    throw new Error('Referenced element not a list');
  }
};

json.checkObj = function(elem) {
  if (elem.constructor !== Object) {
    throw new Error("Referenced element not an object (it was " + (JSON.stringify(elem)) + ")");
  }
};

json.apply = function(snapshot, op) {
  var c, container, e, elem, i, key, p, parent, parentkey, _i, _j, _len, _len1, _ref;

  json.checkValidOp(op);
  op = clone(op);
  container = {
    data: snapshot
  };
  for (i = _i = 0, _len = op.length; _i < _len; i = ++_i) {
    c = op[i];
    parent = null;
    parentkey = null;
    elem = container;
    key = 'data';
    _ref = c.p;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      p = _ref[_j];
      parent = elem;
      parentkey = key;
      elem = elem[key];
      key = p;
      if (parent == null) {
        throw new Error('Path invalid');
      }
    }
    if (c.na !== void 0) {
      if (typeof elem[key] !== 'number') {
        throw new Error('Referenced element not a number');
      }
      elem[key] += c.na;
    } else if (c.si !== void 0) {
      if (typeof elem !== 'string') {
        throw new Error("Referenced element not a string (it was " + (JSON.stringify(elem)) + ")");
      }
      parent[parentkey] = elem.slice(0, key) + c.si + elem.slice(key);
    } else if (c.sd !== void 0) {
      if (typeof elem !== 'string') {
        throw new Error('Referenced element not a string');
      }
      if (elem.slice(key, key + c.sd.length) !== c.sd) {
        throw new Error('Deleted string does not match');
      }
      parent[parentkey] = elem.slice(0, key) + elem.slice(key + c.sd.length);
    } else if (c.li !== void 0 && c.ld !== void 0) {
      json.checkList(elem);
      elem[key] = c.li;
    } else if (c.li !== void 0) {
      json.checkList(elem);
      elem.splice(key, 0, c.li);
    } else if (c.ld !== void 0) {
      json.checkList(elem);
      elem.splice(key, 1);
    } else if (c.lm !== void 0) {
      json.checkList(elem);
      if (c.lm !== key) {
        e = elem[key];
        elem.splice(key, 1);
        elem.splice(c.lm, 0, e);
      }
    } else if (c.oi !== void 0) {
      json.checkObj(elem);
      elem[key] = c.oi;
    } else if (c.od !== void 0) {
      json.checkObj(elem);
      delete elem[key];
    } else {
      throw new Error('invalid / missing instruction in op');
    }
  }
  return container.data;
};

json.pathMatches = function(p1, p2, ignoreLast) {
  var i, p, _i, _len;

  if (p1.length !== p2.length) {
    return false;
  }
  for (i = _i = 0, _len = p1.length; _i < _len; i = ++_i) {
    p = p1[i];
    if (p !== p2[i] && (!ignoreLast || i !== p1.length - 1)) {
      return false;
    }
  }
  return true;
};

json.append = function(dest, c) {
  var last;

  c = clone(c);
  if (dest.length !== 0 && json.pathMatches(c.p, (last = dest[dest.length - 1]).p)) {
    if (last.na !== void 0 && c.na !== void 0) {
      return dest[dest.length - 1] = {
        p: last.p,
        na: last.na + c.na
      };
    } else if (last.li !== void 0 && c.li === void 0 && c.ld === last.li) {
      if (last.ld !== void 0) {
        return delete last.li;
      } else {
        return dest.pop();
      }
    } else if (last.od !== void 0 && last.oi === void 0 && c.oi !== void 0 && c.od === void 0) {
      return last.oi = c.oi;
    } else if (c.lm !== void 0 && c.p[c.p.length - 1] === c.lm) {
      return null;
    } else {
      return dest.push(c);
    }
  } else {
    return dest.push(c);
  }
};

json.compose = function(op1, op2) {
  var c, newOp, _i, _len;

  json.checkValidOp(op1);
  json.checkValidOp(op2);
  newOp = clone(op1);
  for (_i = 0, _len = op2.length; _i < _len; _i++) {
    c = op2[_i];
    json.append(newOp, c);
  }
  return newOp;
};

json.normalize = function(op) {
  var c, newOp, _i, _len, _ref;

  newOp = [];
  if (!isArray(op)) {
    op = [op];
  }
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    if ((_ref = c.p) == null) {
      c.p = [];
    }
    json.append(newOp, c);
  }
  return newOp;
};

clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};

json.canOpAffectOp = function(otherPath, path) {
  var i, p, _i, _len;

  if (otherPath.length === 0) {
    return true;
  }
  if (path.length === 0) {
    return false;
  }
  path = path.slice(0, path.length - 1);
  otherPath = otherPath.slice(0, otherPath.length - 1);
  for (i = _i = 0, _len = otherPath.length; _i < _len; i = ++_i) {
    p = otherPath[i];
    if (i >= path.length) {
      return false;
    }
    if (p !== path[i]) {
      return false;
    }
  }
  return true;
};

json.transformComponent = function(dest, c, otherC, type) {
  var common, common2, commonOperand, convert, cplength, from, jc, oc, otherCplength, otherFrom, otherTo, p, res, tc, tc1, tc2, to, _i, _len;

  c = clone(c);
  if (c.na !== void 0) {
    c.p.push(0);
  }
  if (otherC.na !== void 0) {
    otherC.p.push(0);
  }
  if (json.canOpAffectOp(otherC.p, c.p)) {
    common = otherC.p.length - 1;
  }
  if (json.canOpAffectOp(c.p, otherC.p)) {
    common2 = c.p.length - 1;
  }
  cplength = c.p.length;
  otherCplength = otherC.p.length;
  if (c.na !== void 0) {
    c.p.pop();
  }
  if (otherC.na !== void 0) {
    otherC.p.pop();
  }
  if (otherC.na) {
    if ((common2 != null) && otherCplength >= cplength && otherC.p[common2] === c.p[common2]) {
      if (c.ld !== void 0) {
        oc = clone(otherC);
        oc.p = oc.p.slice(cplength);
        c.ld = json.apply(clone(c.ld), [oc]);
      } else if (c.od !== void 0) {
        oc = clone(otherC);
        oc.p = oc.p.slice(cplength);
        c.od = json.apply(clone(c.od), [oc]);
      }
    }
    json.append(dest, c);
    return dest;
  }
  if ((common2 != null) && otherCplength > cplength && c.p[common2] === otherC.p[common2]) {
    if (c.ld !== void 0) {
      oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.ld = json.apply(clone(c.ld), [oc]);
    } else if (c.od !== void 0) {
      oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.od = json.apply(clone(c.od), [oc]);
    }
  }
  if (common != null) {
    commonOperand = cplength === otherCplength;
    if (otherC.na !== void 0) {

    } else if (otherC.si !== void 0 || otherC.sd !== void 0) {
      if (c.si !== void 0 || c.sd !== void 0) {
        if (!commonOperand) {
          throw new Error("must be a string?");
        }
        convert = function(component) {
          var newC;

          newC = {
            p: component.p[component.p.length - 1]
          };
          if (component.si != null) {
            newC.i = component.si;
          } else {
            newC.d = component.sd;
          }
          return newC;
        };
        tc1 = convert(c);
        tc2 = convert(otherC);
        res = [];
        text._tc(res, tc1, tc2, type);
        for (_i = 0, _len = res.length; _i < _len; _i++) {
          tc = res[_i];
          jc = {
            p: c.p.slice(0, common)
          };
          jc.p.push(tc.p);
          if (tc.i != null) {
            jc.si = tc.i;
          }
          if (tc.d != null) {
            jc.sd = tc.d;
          }
          json.append(dest, jc);
        }
        return dest;
      }
    } else if (otherC.li !== void 0 && otherC.ld !== void 0) {
      if (otherC.p[common] === c.p[common]) {
        if (!commonOperand) {
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0 && type === 'left') {
            c.ld = clone(otherC.li);
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.li !== void 0) {
      if (c.li !== void 0 && c.ld === void 0 && commonOperand && c.p[common] === otherC.p[common]) {
        if (type === 'right') {
          c.p[common]++;
        }
      } else if (otherC.p[common] <= c.p[common]) {
        c.p[common]++;
      }
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] <= c.lm) {
            c.lm++;
          }
        }
      }
    } else if (otherC.ld !== void 0) {
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] === c.p[common]) {
            return dest;
          }
          p = otherC.p[common];
          from = c.p[common];
          to = c.lm;
          if (p < to || (p === to && from < to)) {
            c.lm--;
          }
        }
      }
      if (otherC.p[common] < c.p[common]) {
        c.p[common]--;
      } else if (otherC.p[common] === c.p[common]) {
        if (otherCplength < cplength) {
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0) {
            delete c.ld;
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.lm !== void 0) {
      if (c.lm !== void 0 && cplength === otherCplength) {
        from = c.p[common];
        to = c.lm;
        otherFrom = otherC.p[common];
        otherTo = otherC.lm;
        if (otherFrom !== otherTo) {
          if (from === otherFrom) {
            if (type === 'left') {
              c.p[common] = otherTo;
              if (from === to) {
                c.lm = otherTo;
              }
            } else {
              return dest;
            }
          } else {
            if (from > otherFrom) {
              c.p[common]--;
            }
            if (from > otherTo) {
              c.p[common]++;
            } else if (from === otherTo) {
              if (otherFrom > otherTo) {
                c.p[common]++;
                if (from === to) {
                  c.lm++;
                }
              }
            }
            if (to > otherFrom) {
              c.lm--;
            } else if (to === otherFrom) {
              if (to > from) {
                c.lm--;
              }
            }
            if (to > otherTo) {
              c.lm++;
            } else if (to === otherTo) {
              if ((otherTo > otherFrom && to > from) || (otherTo < otherFrom && to < from)) {
                if (type === 'right') {
                  c.lm++;
                }
              } else {
                if (to > from) {
                  c.lm++;
                } else if (to === otherFrom) {
                  c.lm--;
                }
              }
            }
          }
        }
      } else if (c.li !== void 0 && c.ld === void 0 && commonOperand) {
        from = otherC.p[common];
        to = otherC.lm;
        p = c.p[common];
        if (p > from) {
          c.p[common]--;
        }
        if (p > to) {
          c.p[common]++;
        }
      } else {
        from = otherC.p[common];
        to = otherC.lm;
        p = c.p[common];
        if (p === from) {
          c.p[common] = to;
        } else {
          if (p > from) {
            c.p[common]--;
          }
          if (p > to) {
            c.p[common]++;
          } else if (p === to) {
            if (from > to) {
              c.p[common]++;
            }
          }
        }
      }
    } else if (otherC.oi !== void 0 && otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (c.oi !== void 0 && commonOperand) {
          if (type === 'right') {
            return dest;
          } else {
            c.od = otherC.oi;
          }
        } else {
          return dest;
        }
      }
    } else if (otherC.oi !== void 0) {
      if (c.oi !== void 0 && c.p[common] === otherC.p[common]) {
        if (type === 'left') {
          json.append(dest, {
            p: c.p,
            od: otherC.oi
          });
        } else {
          return dest;
        }
      }
    } else if (otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (!commonOperand) {
          return dest;
        }
        if (c.oi !== void 0) {
          delete c.od;
        } else {
          return dest;
        }
      }
    }
  }
  json.append(dest, c);
  return dest;
};

if (typeof window !== "undefined" && window !== null) {
  exports._bootstrapTransform(json, json.transformComponent, json.checkValidOp, json.append);
} else {
  require('./helpers')._bootstrapTransform(json, json.transformComponent, json.checkValidOp, json.append);
}

module.exports = json;
// This is included after the JS for each type when we build for the web.

  var _types = window.ottypes = window.ottypes || {};
  var _t = module.exports;
  _types[_t.name] = _t;

  if (_t.uri) _types[_t.uri] = _t;
})();
