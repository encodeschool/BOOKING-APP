export function findById(list, id, fallback = "") {
  const item = list.find((i) => i.id === id);
  return item?.name || fallback;
}

export function statCount(items, field, value) {
  return items.filter((i) => i[field] === value).length;
}