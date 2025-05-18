/* eslint-disable @typescript-eslint/no-explicit-any */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function shallowArray(
  a: unknown[],
  b: unknown[],
  compare?: (a: unknown, b: unknown) => boolean,
) {
  const l = a.length;
  if (l !== b.length) return false;

  if (compare) {
    for (let i = 0; i < l; i++) if (!compare(a[i], b[i])) return false;
  } else {
    for (let i = 0; i < l; i++) {
      if (a[i] !== b[i]) return false;
    }
  }

  return true;
}

function shallowObject(
  a: Record<any, unknown>,
  b: Record<any, unknown>,
  compare?: (a: unknown, b: unknown) => boolean,
) {
  let ka = 0;
  let kb = 0;

  if (compare) {
    for (const key in a) {
      if (
        Object.prototype.hasOwnProperty.call(a, key) &&
        !compare(a[key], b[key])
      )
        return false;

      ka++;
    }
  } else {
    for (const key in a) {
      if (Object.prototype.hasOwnProperty.call(a, key) && a[key] !== b[key])
        return false;

      ka++;
    }
  }

  for (const key in b) {
    if (Object.prototype.hasOwnProperty.call(b, key)) kb++;
  }

  return ka === kb;
}

/**
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @param compareFn - A custom comparison function.
 * @returns True if the values are equal, false otherwise.
 * @example ```typescript
 * isEqualShallow(1, 1); // true
 * isEqualShallow(1, 2); // false
 * isEqualShallow('a', 'a'); // true
 * isEqualShallow('a', 'b'); // false
 * isEqualShallow({ a: 1 }, { a: 1 }); // true
 * isEqualShallow({ a: 1 }, { a: 2 }); // false
 * isEqualShallow({ a: [1] }, { a: [1] }); // false
 * isEqualShallow([1, 2], [1, 2]); // true
 * isEqualShallow([1, 2], [1, 3]); // false
 * isEqualShallow([{a : 1}], [{a : 1}]); // false
 * isEqualShallow(null, null); // true
 * isEqualShallow(null, undefined); // false
 * isEqualShallow(undefined, undefined); // true
 * isEqualShallow(undefined, null); // false
 * isEqualShallow(undefined, 0); // false
 * isEqualShallow(0, undefined); // false
 * ```
 */
export function isEqualShallow(
  a: unknown,
  b: unknown,
  compareFn?: (a: unknown, b: unknown) => boolean,
): boolean {
  const typeOfA = typeof a;
  const typeOfB = typeof b;

  if (typeOfA !== typeOfB) return false;

  if (typeOfA === 'object') {
    if (isArray(a) && isArray(b)) {
      return shallowArray(a, b, compareFn);
    }

    return shallowObject(
      a as Record<any, unknown>,
      b as Record<any, unknown>,
      compareFn,
    );
  }

  return compareFn ? compareFn(a, b) : a === b;
}
