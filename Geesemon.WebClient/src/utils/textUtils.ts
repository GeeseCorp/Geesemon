/* eslint-disable no-extend-native */
export const toCamel = (text : string) => {
    return text.replace(/([-_][a-z])/ig, $1 => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

// export class GeeseString extends String
// {
//     const format = function() {
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, function(match, number) { 
//           return typeof args[number] != 'undefined'
//             ? args[number]
//             : match
//           ;
//         });
// }

(Object as any).assign(String.prototype, {
    format(...args: string[]) {
        return (this as string).replace(/{(\d+)}/g, (match, number) => { 
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
         });
        },
});

export type GeeseText = string & {
    format: (...args: string[]) => string;
};