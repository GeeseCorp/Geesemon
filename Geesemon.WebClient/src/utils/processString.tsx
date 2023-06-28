import { Link } from "react-router-dom";

export type ProcessStringOption = {
    fn: (key: number, result: string[]) => React.ReactNode;
    regex: RegExp;
};

export const linkProcessStringOption: ProcessStringOption[] = [{
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => (
        <span key={key} >
            <a
                style={{ textDecoration: 'underline' }}
                target="_blank"
                href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}
                rel="noreferrer"
            >
                {result[2]}.{result[3]} {result[4]}
            </a>
            {result[5]}
        </span>
    ),
},
{
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => (
        <span key={key} >
            <a
                style={{ textDecoration: 'underline' }}
                target="_blank"
                href={`http://${result[1]}.${result[2]}${result[3]}`
                }
                rel="noreferrer"
            >
                {result[1]}.{result[2]} {result[3]}
            </a>
            {result[4]}
        </span>
    ),
}];

export const identifierProcessStringOption: ProcessStringOption = {
    regex: /(@(\w+))/gim,
    fn: (key, result) => (
        <Link key={key} to={`/${result[2]}`}>{result[1]}</Link>
    ),
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