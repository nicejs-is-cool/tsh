// totally not stolen from https://github.com/node-config/node-config/blob/master/lib/config.js
/**
 * Underlying get mechanism
 *
 * @private
 * @method getImpl
 * @param object {object} - Object to get the property for
 * @param property {string|string[]} - The property name to get (as an array or '.' delimited string)
 * @return value {*} - Property value, including undefined if not defined.
 */
export function getImpl(object: any, property: string): string | undefined {
    var elems = Array.isArray(property) ? property : property.split('.')
    var name = elems[0]
    var value = object[name];
  if (elems.length <= 1) {
    return value;
  }
  // Note that typeof null === 'object'
  if (value === null || typeof value !== 'object') {
    return undefined;
  }
  //@ts-ignore
  return getImpl(value, elems.slice(1));
};
export function setImpl(object: any, property: string, value: any): undefined {
    var elems = Array.isArray(property) ? property : property.split('.')
    var name = elems[0]
    var value = object[name];
  if (elems.length <= 1) {
    //return value;
    object[name] = value;
  }
  // Note that typeof null === 'object'
  if (value === null || typeof value !== 'object') {
    return undefined;
  }
  //@ts-ignore
  return getImpl(value, elems.slice(1));
};
