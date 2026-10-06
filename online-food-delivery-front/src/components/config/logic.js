export const isPresentInFavorite = (favorite, restaurant) => {
  if (!Array.isArray(favorite)) return false;

  for (const item of favorite) {
    if (item.id === restaurant.id) {
      return true;
    }
  }

  return false;
};
