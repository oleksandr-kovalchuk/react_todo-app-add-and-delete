import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Todo } from './types/Todo';
import { TypeFilter } from './types/TypeFilter';
import * as apiService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoInput, setNewTodoInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(TypeFilter.All);

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case TypeFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TypeFilter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const notCompletedTasksCounter = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedTasks = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const hasTodos = todos.length > 0;

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await apiService.getTodos();

        setTodos(todosData);
      } catch {
        showError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTodoInput.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    setIsLoading(true);
    const newTodo = {
      id: 0,
      title,
      userId: apiService.USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await apiService.createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setNewTodoInput('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoIds: number[]) => {
    if (!todoIds.length) {
      return;
    }

    setLoadingIds(todoIds);

    const deletionPromises = todoIds.map(async todoId => {
      try {
        await apiService.deleteTodo(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      } catch {
        showError('Unable to delete a todo');
      }
    });

    await Promise.all(deletionPromises);
    setLoadingIds([]);
  };

  const clearCompletedTasks = () => {
    const completedIds = completedTasks.map(todo => todo.id);

    handleDeleteTodo(completedIds);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTodoInput={newTodoInput}
          setNewTodoInput={setNewTodoInput}
          addTodo={addTodo}
          isLoading={isLoading}
          inputRef={inputRef}
          loadingIds={loadingIds}
        />

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingIds={loadingIds}
        />

        {hasTodos && (
          <TodoFooter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            notCompletedTasksCounter={notCompletedTasksCounter}
            isCompletedExists={completedTasks.length > 0}
            clearCompletedTasks={clearCompletedTasks}
          />
        )}
      </div>

      <ErrorNotifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
