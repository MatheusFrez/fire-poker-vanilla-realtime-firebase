const randomKey = (title: string = ''): string => {
  title = title
    .replace(/ /g, '-')
    .toLowerCase();
  const key = Math
    .random()
    .toString(36)
    .substr(2, 5)
    .toLowerCase();
  return `${title}-${key}`;
};

export default randomKey;
