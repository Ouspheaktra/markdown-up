export default function OrderedObject(keyArr=[], valArr=[]) {
    var key = keyArr;
    var val = valArr;
    return {
        add(k, v) {
            if (key.indexOf(k) > 0)
                return Error(`Key : ${k} already exists`);
            key.push(k);
            val.push(v);
        },
        set(k, v) {
            let id = key.indexOf(k);
            if (id < 0)
                throw Error(`Key '${k}' not found`);
            val[id] = v;
        },
        valueOf(k) {
            for (let i in key)
                if (key[i] === k)
                    return val[i];
            return false;
        },
        keys() {
            return key.slice();
        },
        values() {
            return val.slice();
        },
        entries() {
            var out = [];
            for (let i in key)
                out.push([key[i], val[i]]);
            return out;
        },
        addBefore(k, v, beforeKey) {
            let id = key.indexOf(beforeKey);
            if (id < 0)
                throw Error(`Key '${beforeKey}' not found`);
            key.splice(id, 0, k);
            val.splice(id, 0, v);
        },
        addAfter(k, v, afterKey) {
            let id = key.indexOf(afterKey);
            if (id < 0)
                throw Error(`Key '${afterKey}' not found`);
            id++;
            key.splice(id, 0, k);
            val.splice(id, 0, v);
        },
        addFirst(k, v) {
            key.unshift(k);
            val.unshift(v);
        },
        clone() {
            return OrderedObject([...key], [...val])
        },
        get length() {
            return key.length;
        }
    }
}