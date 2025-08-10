export const StringToArray = (value) => {
  return value ? value.split(",").filter(Boolean) : [];
};
