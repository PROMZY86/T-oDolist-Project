const totalTsk = document.querySelector('.tsklen');
const taskcomplete = document.querySelector('.ttlcomplete');
const slider = document.querySelector('.slidder');
const actionbtn = document.querySelector('.actionbtn');
const taskinput = document.querySelector('.taskinput');
const notification = document.querySelector('.notification');
const notifytxt = document.querySelector('.helloNotify');
const rtnContent = document.querySelector('.contentside');

//eventlistener to btn
actionbtn.addEventListener('click', function(event){
	
	//notification.classList.remove('pushIn');
	//check if input is empty
	if(taskinput.value == '' || taskinput.value.length <=0){
		notification.classList.add('pushOut');1
		notifytxt.innerHTML = 'Please enter your task...';
		setTimeout(() => {
			//notification.classList.add('pushIn');
			notification.classList.remove('pushOut');
		}, 3000)
	
		return;
	}
	
	saveToStorage(taskinput.value, false);

	notification.classList.add('pushOut');
	notifytxt.innerHTML = 'Task added successfully.';
	taskinput.blur();
	setTimeout(() => {
		//notification.classList.add('pushIn');
		notification.classList.remove('pushOut');
	}, 3000)
	displayTask(taskinput.value, false);
	taskinput.value = '';
	totalTsk.innerHTML = getFromStorage().length;
	Updslider();
})



taskinput.onkeyup = function(event){
	if(event.key == 'Enter'){
		actionbtn.click();
	}
}

function saveToStorage(tsk, iscomplete){
	let task = getFromStorage();
		task.push({task: tsk, complete: iscomplete});
	
		localStorage.setItem('myTodoList', JSON.stringify(task));
}

function getFromStorage(){
	let task = localStorage.getItem('myTodoList');
	return task ? JSON.parse(task) : [];
};



function displayTask(tsk, status){
	let wrapper = newElement('div');
		wrapper.className = '__xlx__';
			let wrapChild1 = newElement('input');
				wrapChild1.className = '__to_check__';
				wrapChild1.type = 'checkbox';
				wrapChild1.checked = status;
		wrapper.appendChild(wrapChild1);
		
				wrapChild1.addEventListener('change', function(){
					
					//alert(this.checked)
					updateTaskState(tsk, this.checked, event);
				})
		
			let divchild = newElement('div');
				divchild.className = 'todoTxrWrap';
					let ptag = newElement('p');
						ptag.className = '';
						ptag.innerHTML = tsk;
						ptag.title = tsk;
						ptag.className = 'myp';
					divchild.appendChild(ptag);
				
		wrapper.appendChild(divchild);
		
			let divAction = newElement('div');
				divAction.className = 'editAction';
					let spn1 = newElement('span');
						spn1.className = 'editTask fasFas';
						spn1.innerHTML = '<i class="fas fa-edit"></i>';
				divAction.appendChild(spn1);
				let spn2 = newElement('span');
						spn2.className = 'deleteTask fasFas';
						spn2.innerHTML = '<i class="fas fa-trash-alt"></i>';
				divAction.appendChild(spn2);
				
		wrapper.appendChild(divAction);

				spn1.addEventListener('click', function(event){
					editTask(tsk, event, this)
				})

		spn2.addEventListener('click', function(event){
			toDeleteTask(tsk, event)
      })
		
	rtnContent.insertAdjacentElement('afterbegin', wrapper);
	
};

function updateContent(){
	let task = getFromStorage();
		task.forEach((obj, i) =>{
			displayTask(obj.task, obj.complete);
		})

  totalTsk.innerHTML = getFromStorage().length;
  Updslider()
	
};


//function to toggle complete state
function updateTaskState(tsk, status, ev){
	let task = getFromStorage();
	let tskEle = ev.target.parentElement.querySelector('p'); //.closest('.myp');
    tk = status ? 'markAscomplete' : '' ;
	   task.forEach((obj, i) => {
			
			if(obj.task === tsk){
				obj.complete = status;
			}
			
		})
	
	localStorage.setItem('myTodoList', JSON.stringify(task));
	Updslider();
};

function completedTask(){
	let task = getFromStorage();
    let cmp = task.filter(task => task.complete == true).length
		 
  return cmp
}

function Updslider(){
	let slidVal;
    let task = getFromStorage();
       //task ? task : 0;
    slidVal = completedTask() > 0 ? (completedTask() / task.length) * 100 : 0;
	slider.style.setProperty('width', `${slidVal}%`);
    //slider.style.setProperty('width', `${(completedTask() / getFromStorage().length) * 100}%`)
	taskcomplete.innerHTML = completedTask() + '/';
}; 




function toDeleteTask(tsk, ev){
	let task =getFromStorage();
	let newtask = task.filter(task => task.task !== tsk);
	let parentEle = ev.target.closest('.__xlx__')
	  localStorage.setItem('myTodoList', JSON.stringify(newtask));

	  parentEle.remove()
      totalTsk.innerHTML = getFromStorage().length;
	  Updslider()

	  notification.classList.add('pushOut');
	  notifytxt.innerHTML = 'You have Sucessfully deleted 1 task';
	  setTimeout(() => {
		  //notification.classList.add('pushIn');
		  notification.classList.remove('pushOut');
	  }, 3000)
}

function editTask(tsk, ev, d){
	
	let ptg = d.parentNode.parentNode.querySelector('.myp') //closest()
    console.log(ptg)
	// return;
	ptg.contentEditable = true;
	ptg.focus();
	let task = getFromStorage();
	
	let currStorage = task;
	notification.classList.add('pushOut');
	notifytxt.innerHTML = 'Edit mode is active'
	setTimeout(() => {
		//notification.classList.add('pushIn');
		notification.classList.remove('pushOut');
	}, 3000)

	ptg.addEventListener('keydown', (event) =>{
		if(event.key == 'Enter'){
         ptg.contentEditable = false;
		 
		 let newTask = ptg.innerHTML;
		 task.filter(task => {
			if(task.task === tsk){
				task.task = newTask;

			localStorage.setItem('myTodoList', JSON.stringify(currStorage))
			}
		 })
		}
	})


}

document.addEventListener('DOMContentLoaded', updateContent);

function newElement(d){
	return document.createElement(d);
}

/// afterbegin, beforebegin, afterend, beforeend

//completedTask / totaltask * 100