let exampleToDoList = {
    "Work": {
        "Meeting": 0
    }
}

let getToDoList = new Promise((res, rej) => {

    if (getToDoInCache()) {
        console.log("ToDoList already created")
        res("TodoList: " + getToDoInCache())
    }
    else {
        console.log("Creating a new one")
        setToDoInCache(exampleToDoList)
        rej("No ToDoList detected, created new with example values: ", exampleToDoList)
    }
})

getToDoList.then().catch()

let myToDoList

$(document).ready(()=> {
    myToDoList = getToDoInCache()
    updateInServerToDoList(myToDoList)
    buttonsHandle();
    taskCompletedHandle(myToDoList)
});


function updateInServerToDoList(myToDoList) {
    fetch("/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ toDoList: myToDoList })
    })
    .then(response => {
        if (response.ok) {
            
           
        } else {
         
            console.error('Error al actualizar en el servidor.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function taskCompletedHandle(myToDoList) {
    for (let category in myToDoList) {
        const tasks = myToDoList[category];
        const allTasksCompleted = Object.values(tasks).every(value => value === 1);

        if (allTasksCompleted) {
            $("#" + category + " .task-category-icon").html("done").addClass("task-completed");
        } else {
            $("#" + category + " .task-category-icon").html("close").removeClass("task-completed")
        }
    }
}

function setToDoInCache(myToDoList) {
    localStorage.setItem("myTodoList", JSON.stringify(myToDoList));
}

function getToDoInCache() {
    let myToDoList = JSON.parse(localStorage.getItem("myTodoList"));
    if(!exampleToDoList){
        localStorage.setItem("myTodoList", JSON.stringify(myToDoList));
    }
    return myToDoList
}

function taskHandle() {

    let myToDoList = getToDoInCache()
    const taskName = $(this).next().html().trim();
    const category = $(this).closest('.container-task').find('.task-category').attr("id");

    myToDoList[category][taskName] = myToDoList[category][taskName] === 0 ? 1 : 0;
    console.log("myToDoList:", myToDoList);
    console.log("taskName:", taskName);
    console.log("category:", category);
    setToDoInCache(myToDoList)
    updateInServerToDoList(myToDoList)

    const allTasksCompleted = Object.values(myToDoList[category]).every(value => value === 1);

    if (allTasksCompleted) {
        $("#" + category + " .task-category-icon").html("done").addClass("task-completed");
    } else {
        $("#" + category + " .task-category-icon").html("close").removeClass("task-completed")
    }
    

}


function buttonsHandle() {
    myTodoList = getToDoInCache();

    if (alreadyCategoryTask(myTodoList)) {
        $(".task-edit, .task-delete").show();
    }
    else {
        $(".task-edit, .task-delete").hide();
    }

}

function alreadyCategoryTask(myTodoList) {
    if (!myTodoList || Object.keys(myTodoList).length === 0) {
        return false;
    }

    for (const category in myTodoList) {
        if (Object.keys(myTodoList[category]).length > 0) {
            return true;
        }
    }
    return false;
}


function handleChanges(myToDoList){
    setToDoInCache(myToDoList);
    updateInServerToDoList(myToDoList);
    
    buttonsHandle();
    location.reload();
}

$("#categorySelect").on("click focus change", function () {
    var selectedValue = $(this).val();
    var lastOptionValue = $('#categorySelect option:last').val();

    if (selectedValue === lastOptionValue || selectedValue == "NewCategory") {
        $('#categoryName').show();
    } else {
        $('#categoryName').hide();
    }
});

$("#taskOrCategoryEdit").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue === 'editCategory') {

        $("#labelNewCategoryTask").text("New Category Name");
        $("#categoryNameEdit").show();
        $("#taskNameEdit").hide();
    } else if (selectedValue === 'editTaskName') {

        $("#labelNewCategoryTask").text("New Task Name");
        $("#categoryNameEdit").hide();
        $("#taskNameEdit").show();
    }
})

$("#taskOrCategoryDelete").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue === 'deleteCategory') {


        $("#categoryNameDelete").show();
        $("#taskNameDelete").hide();

    } else if (selectedValue === 'deleteTaskName') {


        $("#categoryNameDelete").hide();
        $("#taskNameDelete").show();
    }
})

$(".task-name input").each(function () {
    $(this).on("click", taskHandle)
});


$(".task-icon").click(function(){
    $('#categoryName, #categoryName-info,#taskName-info, #taskNameEdit, #taskNameDelete').hide();
})


$("#create-task").click(function () {
    let myToDoList = getToDoInCache()
    const taskName = $("#taskName").val()
    const taskCategory = $("#categorySelect").val()

    
    if (taskName.trim() === "") {
        $("#taskName-info").html("Field Required").show();
        return;
    }

    if ($('#categoryName').is(":hidden")) {

        myToDoList[taskCategory][taskName] = 0;

        $("#" + taskCategory + "-list").append(`<li class="task-name">
        <input type="checkbox" class="task-check" name="${taskName}" id="${taskName}" checked>
        <label class="${taskCategory}" for="${taskName}">${taskName}</label>
      </li>`)

    }

    else {
        //If user set a CategoryName already exists show a error and cancel function
        if ($('#input-categoryName').val().trim() === "") {
            $("#categoryName-info").text("Field Required").show();
            return;
        }

        if (myToDoList[$('#input-categoryName').val()]) {
            $('#categoryName-info').text("Already exists").show();
            return;
        }


        else {
            //Delete any spaces from end an start to avoid error in ID HTML
            const userInputValue = $("#input-categoryName").val().trim()
            const taskCategory = userInputValue.replace(/\s+/g, '-');
            setToDoInCache(myToDoList)

            myToDoList[taskCategory] = {};
            myToDoList[taskCategory][taskName] = 0;


            $(".container-task").after(`<div class="container-task>`);
            $(".container-tasks").append(` <div class="container-task ">
                <h1 class="task-category" id="${taskCategory}">
                  <i class="material-icons-outlined task-category-icon">close</i>
                  ${taskCategory}
                </h1>
                <ul class="task-list pb-2">
                  <li class="task-name">
                    <input type="checkbox" class="task-check" name="${taskName}" id="${taskName}">
                    <label class="${taskCategory}" for="${taskName}">${taskName}</label>
                  </li>
                </ul>
              </div>`);

        }

    }

    handleChanges(myToDoList);
   
})


$("#edit-task").click(function () {
    myToDoList = getToDoInCache()
    var selectedValue = $("#taskOrCategoryEdit").val();
    

    if ($('#newTaskNameCategory').val().trim() === "") {
        $("#newTaskNameCategory-info").text("Field Required").show();
        return;
    }
    if (selectedValue === 'editCategory') {
        const taskCategory = $("#categorySelectEdit").val()
        const newTaskCategory = $("#newTaskNameCategory").val().replace(/\s+/g, '-');

        if (myToDoList[newTaskCategory]) {
            $("#newTaskNameCategory-info").text("Already exists").show();
            return;
        }

        $("#" + taskCategory).html('<i class="material-icons-outlined task-category-icon"></i> ' + newTaskCategory)
        myToDoList[newTaskCategory] = myToDoList[taskCategory];
        delete myToDoList[taskCategory];
    }

    else {
        const selectedTask = $("#taskSelectEdit option:selected");
        const taskName = selectedTask.val();
        const categoryTaskName = selectedTask.data("category");
        const newTaskName = $("#newTaskNameCategory").val()

        if (myToDoList[categoryTaskName][newTaskName]) {
            $("#newTaskNameCategory-info").text("Already exists").show();
            return;
        }

        $("#" + categoryTaskName + "-" + taskName.replace(/\s+/g, '-')).next().text(newTaskName)
        myToDoList[categoryTaskName][newTaskName] = myToDoList[categoryTaskName][taskName];
        delete myToDoList[categoryTaskName][taskName];

    }

    handleChanges(myToDoList);

})


$("#delete-task").click(function () {
    myToDoList = getToDoInCache();
    var selectedValue = $("#taskOrCategoryDelete").val();

    if (selectedValue === 'deleteCategory') {
        const categoryToDelete = $("#categorySelectDelete").val();
        console.log("Categoría a eliminar:", categoryToDelete);
        delete myToDoList[categoryToDelete];
        console.log("Categoría eliminada:", categoryToDelete);
    }
    else {

        const selectedTask = $("#taskSelectDelete option:selected");
        const taskName = selectedTask.val();
        const categoryTaskName = selectedTask.data("category");
        console.log("Tarea a eliminar:", taskName);


        delete myToDoList[categoryTaskName][taskName];
        console.log("Tarea eliminada:", taskName);
    }
    
    handleChanges(myToDoList);
});
