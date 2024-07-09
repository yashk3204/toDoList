document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const fetchTodos = async () => {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        todoList.innerHTML = '';
        todos.forEach(todo => {
            addTodoToDOM(todo);
        });
    };

    const addTodoToDOM = todo => {
        const li = document.createElement('li');
        li.dataset.id = todo._id;
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="complete">${todo.completed ? 'Undo' : 'Complete'}</button>
            </div>
        `;
        todoList.appendChild(li);
    };

    const addTodo = async text => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        addTodoToDOM(newTodo);
    };

    const updateTodo = async (id, text, completed) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, completed })
        });
        const updatedTodo = await response.json();
        const li = todoList.querySelector(`[data-id="${id}"]`);
        li.querySelector('span').textContent = updatedTodo.text;
        li.className = updatedTodo.completed ? 'completed' : '';
    };

    const deleteTodo = async id => {
        await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        const li = todoList.querySelector(`[data-id="${id}"]`);
        todoList.removeChild(li);
    };

    todoForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });

    todoList.addEventListener('click', e => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.closest('li').dataset.id;
            deleteTodo(id);
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.closest('li').dataset.id;
            const text = prompt('Edit the task:', e.target.closest('li').querySelector('span').textContent);
            if (text !== null) {
                updateTodo(id, text, false);
            }
        } else if (e.target.classList.contains('complete')) {
            const id = e.target.closest('li').dataset.id;
            const li = e.target.closest('li');
            const completed = !li.classList.contains('completed');
            updateTodo(id, li.querySelector('span').textContent, completed);
        }
    });

    fetchTodos();
});
