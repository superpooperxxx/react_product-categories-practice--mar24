export const getFilteredProducts = (products, filters) => {
  const { selectedUserId, query, selectedCategoriesId, sort } = filters;

  let filteredProducts = [...products];

  // Filtering by user
  if (selectedUserId !== null) {
    filteredProducts = filteredProducts.filter(
      product => product.user.id === selectedUserId,
    );
  }

  // Filtering by query
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery) {
    filteredProducts = filteredProducts.filter(product => {
      const normalizedProductName = product.name.trim().toLowerCase();

      return normalizedProductName.includes(normalizedQuery);
    });
  }

  // Filtering by categories
  if (selectedCategoriesId.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      selectedCategoriesId.includes(product.category.id),
    );
  }

  // Sorting
  filteredProducts.sort((product1, product2) => {
    switch (sort.by) {
      case 'id':
        return product1.id - product2.id;
      case 'product':
        return product1.name.localeCompare(product2.name);
      case 'category':
        return product1.category.title.localeCompare(product2.category.title);
      case 'user':
        return product1.user.name.localeCompare(product2.user.name);
      default:
        return 0;
    }
  });

  // Reverse
  if (sort.order === 'desc') {
    filteredProducts.reverse();
  }

  return filteredProducts;
};
