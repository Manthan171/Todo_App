let todos = [];
let isEdit = false;
let editId = null;

const todoForm = document.querySelector('#todoForm');
const btn = document.querySelector('#btn');
const title = document.querySelector('#title');
const description = document.querySelector('#description');

// When the user clicks on the Add Todo button
btn.addEventListener('click',function() {

    const form = new FormData(todoForm);
    var formValues = {};

    for(var val of form.keys()){
        formValues[val] = form.get(val);
    }

    if(!isEdit){
        // add functionality

        var todo = getTodo(formValues.title, formValues.description);
        todos = [...todos, todo];
    }
    else{
        // edit functionality
        var newTodos = [...todos];
        var idx = newTodos.findIndex(t => t.id == editId);
        var t = {...newTodos[idx]};
        t.title = formValues.title;
        t.description = formValues.description;
        newTodos[idx] = t;
        releaseEditLock();
        todos = newTodos;
    }

    title.value = null;
    description.value = null;
    persistTodos(todos);
    render(todos);
});

function persistTodos(todos){
    localStorage.setItem('todos', JSON.stringify(todos));
}

function editLock(id){
    console.log(id);
    editId = id;
    isEdit = true;
    btn.textContent = 'Save';

}

function releaseEditLock(){
    editId = null;
    isEdit = false;
    btn.textContent = 'Add Todo';

}

// which gives me a new todo to add

function getTodo(title, description) {

    // Task 1
    // I have to extract the last element and get out its id
    // And id + 1 will be our new ID

    var id;

    if(todos.length == 0) id = 1;
    else{
        var last = todos[todos.length - 1];
        id = last.id + 1;
    }

    return{
        id,
        title,
        description,
        createdAt: new Date().toString(),
        status: 'active',
    }
}

// This renderes the todo lists to the browser

function render(todos) {
    
    const todo_list = document.querySelector('.todo_list');
    
    const items = todos.map(todo => renderATodoItem(todo));

    //I have to clear all the content inside that
    todo_list.innerHTML = null;

    items.forEach(item => {
        todo_list.appendChild(item);
    })
}

// Render a list item

function renderATodoItem(todo) {
    const mainRow = document.createElement('div');
    mainRow.className = 'row jumbotron section';
    
    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    const statusDiv = document.createElement('div');
    titleDiv.className = 'col-md-2';
    titleDiv.textContent = todo.title;
    descriptionDiv.className = 'col-md-2';
    descriptionDiv.textContent = todo.description;
    statusDiv.className = 'col-md-2';
    statusDiv.textContent = todo.status;

    let markCompletedDiv = document.createElement('div');
    markCompletedDiv.className = 'col-md-2';

    let statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-info';
    statusBtn.textContent = 'Mark Completed';

    statusBtn.addEventListener('click',() => {

        // Task 2
        // You have to find out a todo from that list of todos whose id is todo.id (find function)

        // you need to change the status of that and call the render function again

        // Mutable way

        // var t = todos.find(t => t.id == todo.id);
        // t.status = 'Completed';
        // render(todos);

        // Immutable way

        var newTodos = [...todos];
        var idx = todos.findIndex(t => t.id == todo.id);
        var t = {...newTodos[idx]};
        t.status = 'Completed';
        newTodos[idx] = t;
        todos = newTodos;
        persistTodos(todos);
        render(newTodos);
    });

    markCompletedDiv.appendChild(statusBtn);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'col-md-4';

    const row = document.createElement('div');
    row.className = 'row';

    let editDiv = document.createElement('div');
    editDiv.className = 'col-md-3';

    statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-primary';
    statusBtn.textContent = 'Edit';

    statusBtn.addEventListener('click', function () {
        title.value = todo.title;
        description.value = todo.description;
        editLock(todo.id);
    })

    editDiv.appendChild(statusBtn);

    row.appendChild(editDiv);

    let statusAction = document.createElement('div');
    statusAction.className = 'col-md-3';

    statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-danger';
    statusBtn.textContent = 'Delete';

    statusBtn.addEventListener('click',() => {
        console.log(todo.id);

        // Task 3 
        // you have to remove todo from todos whose id is todo.id (filter function)
        // after that you have to call render function again

        // Immutable way

        var newTodos = todos.filter(t => t.id != todo.id);
        todos = newTodos;
        persistTodos(todos);
        render(newTodos);
    });

    statusAction.appendChild(statusBtn);

    row.appendChild(statusAction);

    actionsDiv.appendChild(row);

    mainRow.appendChild(titleDiv);
    mainRow.appendChild(descriptionDiv);
    mainRow.appendChild(statusDiv);
    mainRow.appendChild(markCompletedDiv);
    mainRow.appendChild(actionsDiv);

    return mainRow;
}

render(todos); 