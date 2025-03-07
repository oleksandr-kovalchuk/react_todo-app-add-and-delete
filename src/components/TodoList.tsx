import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  isLoading,
  loadingIds,
}) => {
  const todoItems = todos.map(todo => (
    <CSSTransition key={todo.id} timeout={300} classNames="item">
      <TodoItem
        todo={todo}
        handleDeleteTodo={handleDeleteTodo}
        isLoading={false}
        loadingIds={loadingIds}
      />
    </CSSTransition>
  ));

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todoItems}
        {tempTodo && (
          <CSSTransition key="temp" timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              isLoading={isLoading}
              loadingIds={loadingIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
