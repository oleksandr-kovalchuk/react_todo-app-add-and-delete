import React, { useState, useEffect, useMemo } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const todos = await getTodos();

        setTodoList(todos);
      } catch {
        setErrorMessage('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(null), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case Filter.Active:
        return todoList.filter(todo => !todo.completed);

      case Filter.Completed:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [todoList, currentFilter]);

  const activeTodosCount = useMemo(
    () => todoList.filter(todo => !todo.completed).length,
    [todoList],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {loading ? (
          <div className="notification is-info">Loading...</div>
        ) : (
          todoList.length > 0 && (
            <>
              <TodoList todos={filteredTodos} />

              <Footer
                activeCount={activeTodosCount}
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
              />
            </>
          )
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={() => setErrorMessage(null)}
      />
    </div>
  );
};
