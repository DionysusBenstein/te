import _ from 'lodash';

export function collapse(stem, sep) {
    return function(map, value, key) {
        const prop = stem ? stem + sep + key : key;
        if(_.isFunction(value)) map[prop] = value;
        else if(_.isObject(value)) map = _.reduce(value, collapse(prop, sep), map);
        return map;
    }
}
