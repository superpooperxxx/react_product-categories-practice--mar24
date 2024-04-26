/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
/* eslint-disable */
import { clsx } from 'clsx';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { getFilteredProducts } from './utils/getFilteredProducts';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(cat => cat.id === product.categoryId) || null;
  const user =
    usersFromServer.find(person => person.id === category.ownerId) || null;

  return {
    ...product,
    category,
    user,
  };
});

const COLUMNS = {
  id: 'ID',
  product: 'Product',
  category: 'Category',
  user: 'User',
};

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);
  const [sort, setSort] = useState({
    by: null,
    order: 'asc',
  });

  const filteredProducts = getFilteredProducts(products, {
    selectedUserId,
    query,
    selectedCategoriesId,
    sort,
  });

  const handleResetAllFilters = () => {
    setSelectedUserId(null);
    setQuery('');
  };

  const isCategorySelected = categoryId => {
    return selectedCategoriesId.includes(categoryId);
  };

  const handleToggleCategory = categoryId => {
    if (isCategorySelected(categoryId)) {
      setSelectedCategoriesId(current =>
        current.filter(id => id !== categoryId),
      );
    } else {
      setSelectedCategoriesId(current => [...current, categoryId]);
    }
  };

  const handleSort = columnName => {
    if (sort.by !== columnName) {
      setSort({
        by: columnName,
        order: 'asc',
      });

      return;
    }

    if (sort.by === columnName && sort.order === 'asc') {
      setSort({
        by: columnName,
        order: 'desc',
      });

      return;
    }

    setSort({
      by: null,
      order: 'asc',
    });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={clsx({
                  'is-active': selectedUserId === null,
                })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={clsx({
                    'is-active': user.id === selectedUserId,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={clsx('button is-success mr-6', {
                  'is-outlined':
                    selectedCategoriesId.length &&
                    selectedCategoriesId.length &&
                    categoriesFromServer.length !== selectedCategoriesId.length,
                })}
                onClick={() => setSelectedCategoriesId([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={clsx('button mr-2 my-1', {
                    'is-info': isCategorySelected(category.id),
                  })}
                  href="#/"
                  onClick={() => handleToggleCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!!filteredProducts.length && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {Object.entries(COLUMNS).map(([columnId, columnName]) => (
                    <th key={columnId}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {columnName}
                        <a href="#/" onClick={() => handleSort(columnId)}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={clsx('fas', {
                                'fa-sort': sort.by !== columnId,
                                'fa-sort-down':
                                  sort.by === columnId && sort.order === 'desc',
                                'fa-sort-up':
                                  sort.by === columnId && sort.order === 'asc',
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(({ category, user, ...product }) => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {category.icon} - {category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
