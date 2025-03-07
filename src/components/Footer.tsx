import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

type FooterProps = {
  activeCount: number;
  currentFilter: Filter;
  setCurrentFilter: (filter: Filter) => void;
};

const Footer: React.FC<FooterProps> = ({
  activeCount,
  currentFilter,
  setCurrentFilter,
}) => {
  const formatFilter = (filter: Filter) => {
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  const handleFilterClick =
    (filter: Filter) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setCurrentFilter(filter);
    };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={filter === Filter.All ? '#/' : `#/${filter}`}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={`FilterLink${formatFilter(filter)}`}
            onClick={handleFilterClick(filter)}
          >
            {formatFilter(filter)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
