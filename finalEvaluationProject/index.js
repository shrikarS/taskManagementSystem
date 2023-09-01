console.log("javascript Started");

let selectedRow = null;
let mainData = [];

// Main function

function submitForm(e){
    event.preventDefault();
    
    let formData = getData();

    if(formData === null){

    }
    else if(selectedRow == null){
        addData();
        console.log('if executed');
        resetForm();
    }
    else{
        updateRecord(formData);
        console.log('else executed');
        resetForm();
    }
    
}

// function to getData

function getData(){
    console.log('getData Function started');
    
    let temp = {};
    temp.taskId = document.getElementById('idTask').value;
    temp.taskName = document.getElementById('name').value;
    temp.startDate = document.getElementById('startDate').value;
    temp.endDate = document.getElementById('endDate').value;
    temp.status = document.getElementById('status').value;
    temp.subTasks = [];
    console.log(mainData);
    if(selectedRow === null && mainData.find((id) => id.taskId == temp.taskId)){
        alert('ID Taken! Add diffrent Task ID');
        return null;
    }
    if(temp.startDate > temp.endDate){
        alert('End Date cannot be less than Start Date');
        return null;
    }
    
    
    if(selectedRow === null){
        mainData.push(temp);    
    }
    
    return temp;
    
}
// function to add data to the table on the html page
function addData() {
    console.log('addData Function started');
    
    let innerHTML = `
        <tr>
            <th>Task ID</th>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
        </tr>`;

    mainData.forEach(task => {
        innerHTML += `<tr>
            <td>${task.taskId}</td>
            <td>${task.taskName}</td>
            <td>${task.startDate}</td>
            <td>${task.endDate}</td>
            <td>${task.status}</td>
            <td><button onClick="editData(this)">Edit</button> <button onClick="onDelete(this)">Delete</button> <button onClick="showSubtaskForm(this)">Add subtask</button></td>
        </tr>`;

        if (task.subTasks.length > 0) {
            innerHTML += `<tr><th colspan="6">Sub Task List</th></tr>`;
            task.subTasks.forEach(subTask => {
                innerHTML += `<tr>
                    <td>${subTask.subTaskId}</td>
                    <td>${subTask.subTaskName}</td>
                    <td>${subTask.startDate}</td>
                    <td>${subTask.endDate}</td>
                    <td>${subTask.status}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                </tr>`;
            });
        }
    });
    document.getElementById("tableContent").innerHTML = innerHTML;
}

// edit the content of the  parent task table row.

function editData(td){
    selectedRow = td.parentElement.parentElement;
    document.getElementById('idTask').value = selectedRow.cells[0].innerHTML;
    document.getElementById('name').value = selectedRow.cells[1].innerHTML;
    document.getElementById('startDate').value = selectedRow.cells[2].innerHTML;
    document.getElementById('endDate').value = selectedRow.cells[3].innerHTML;
    document.getElementById('status').value = selectedRow.cells[4].innerHTML;
    
}

function updateRecord(data){  
    let mainId = selectedRow.cells[0].innerHTML;
    for(let i of mainData){
        if(i.taskId == mainId){
            i.taskId = data.taskId;
            i.taskName = data.taskName;
            i.startDate = data.startDate;
            i.endDate = data.endDate;
            i.status = data.status;
        }
    }
    addData();
}

// delete function for the row

function onDelete(td) {
    if (confirm('Do you want to delete this record?')) {
        row = td.parentElement.parentElement;
        mainId = row.cells[0].innerHTML;
        for(let i in mainData){
            if(i.taskId == mainId){
                i.status = 'deleted';
            }
        }

        console.log('main block' + mainId);
        document.getElementById('tableMain').deleteRow(row.rowIndex);
        resetForm(); 
    }
}

function resetForm(){
    document.getElementById('idTask').value  = '';
    document.getElementById('name').value  = '';
    document.getElementById('startDate').value  = '';
    document.getElementById('endDate').value  = '';
    document.getElementById('status').value  = '';
    selectedRow = null;
}

function addSubtask(taskId, subTask){
    let task = mainData.find(t => t.taskId === taskId);
    console.log(task);

    if(task.startDate > subTask.startDate || task.endDate < subTask.endDate){
        alert('The Subtask Date need to be in between ' + task.startDate + ' and ' + task.endDate);
    }
    else if(task){
        task.subTasks.push(subTask);
        console.log('subtask added');
    }
    else{
        console.error('Task not found');
    }

}

function showSubtaskForm(temp){
    // Takes the parent task ID
    let tr = temp.parentElement.parentElement;
    let mainId = tr.cells[0].innerHTML;
    console.log(tr.rowIndex);
    document.getElementById('hiddenForm').style.display = 'block';
    document.getElementById('parentTaskId').value = mainId;
    

    document.getElementById('subtaskForm').addEventListener('submit', function(event){
        event.preventDefault();
        let parentTaskId = document.getElementById('parentTaskId').value;
        let parentTask = mainData.find(task => task.taskId === parentTaskId);
        let subTaskName = document.getElementById('subTaskName').value;
        let subTaskStartDate = document.getElementById('subTaskStartDate').value;
        let subTaskEndDate = document.getElementById('subTaskEndDate').value;
        let subTaskStatus = document.getElementById('subTaskStatus').value;
        let subTaskId = `${parentTaskId}.${parentTask.subTasks.length + 1}`;
        let newSubtask = {
            subTaskId: subTaskId,
            subTaskName: subTaskName,
            startDate: subTaskStartDate,
            endDate: subTaskEndDate,
            status:subTaskStatus,
            subtask:[],
        }
        addSubtask(parentTaskId,newSubtask)
        addData();
        document.getElementById('hiddenForm').style.display = 'none';
        resetSubTaskForm();
        

    });
}

// reset subtask form

function resetSubTaskForm(){
    document.getElementById('subTaskName').value = '';
    document.getElementById('subTaskStartDate').value = '';
    document.getElementById('subTaskEndDate').value = '';
    document.getElementById('parentTaskId').value = '';

}