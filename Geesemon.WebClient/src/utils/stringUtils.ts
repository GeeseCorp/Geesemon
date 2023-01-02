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
    regex: RegExp;
};

export const processString = (options: ProcessStringOption[]) => {
    let key = 0;

    const processInputWithRegex = (option: ProcessStringOption, input: string | Array<string>): any => {
        if (!option.fn || !option.regex)
         return input;

        if (Array.isArray(input)) {
            return input.map(chunk => {
                return processInputWithRegex(option, chunk);
            });
        }
        else {
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
        } 
    };

    return (input: string) => {
        if (!options || !Array.isArray(options) || !options.length) 
            return input;

        options.forEach(option => {
            return input = processInputWithRegex(option, input);
        });

        return input;
    };
};

export const getFileName = (str: string): string => {
    const parts = str.split('/');
    if(!parts.length)
        return '';
    const lastPart = parts[parts.length - 1];
    return lastPart.substring(37);
};

export const getFileExtension = (str: string): string => {
    const parts = str.split('.');
    if(!parts.length)
        return '';
    const lastPart = parts[parts.length - 1];
    return lastPart.substring(1);
};