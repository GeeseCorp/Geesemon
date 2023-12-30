export const getFirstAndLastName = (name: string) => {
  const parts = name?.split(' ')[0] || [];
  const firstName = parts.length ? parts[0] : '';
  const lastName = parts.length > 1 ? parts[1] : '';
  return [firstName, lastName] as const;
};

export const toCamel = (text : string) => {
  return text.replace(/([-_][a-z])/ig, $1 => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const formatGeesetext = (text: string | undefined, ...args: (string | number | null | undefined)[]) => {
  if(!text)
    return '';
  return text.replace(/{(\d+)}/g, (match, number) => args[number]?.toString() || match);
};
