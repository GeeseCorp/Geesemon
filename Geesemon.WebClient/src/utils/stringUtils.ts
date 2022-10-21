export const getFirstAndLastName = (name: string) => {
    const parts = name?.split(' ')[0] || [];
    const firstName = parts.length ? parts[0] : '';
    const lastName = parts.length > 1 ? parts[1] : '';
    return [firstName, lastName] as const;
};

export const isGuidEmpty = (guid: string): boolean => {
    return guid === '00000000-0000-0000-0000-000000000000';
};

export type ProcessStringOption = {
    fn: (key: number, result: string[]) => React.ReactNode;
    regex: RegExp | string;
};

export const processString = (options: ProcessStringOption[]) => {
    let key = 0;

    function processInputWithRegex(option: ProcessStringOption, input: string | Array<string>): any {
        if (!option.fn || typeof option.fn !== 'function')
         return input;

        if (!option.regex || !(option.regex instanceof RegExp))
         return input;

        if (typeof input === 'string') {
            const regex = option.regex;
            let result = null;
            const output = [];

            while ((result = regex.exec(input)) !== null) {
                const index = result.index;
                const match = result[0];

                output.push(input.substring(0, index));
                output.push(option.fn(++key, result));

                input = input.substring(index + match.length, input.length + 1);
                regex.lastIndex = 0;
            }

            output.push(input);
            return output;
        } else if (Array.isArray(input)) {
            return input.map(chunk => {
                return processInputWithRegex(option, chunk);
            });
        } else 
            return input;
        }

    return (input: string) => {
        if (!options || !Array.isArray(options) || !options.length) 
            return input;

        options.forEach(function (option) {
            return input = processInputWithRegex(option, input);
        });

        return input;
    };
};