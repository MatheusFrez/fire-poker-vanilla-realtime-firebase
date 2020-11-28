const toSimpleJson = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export default toSimpleJson;
