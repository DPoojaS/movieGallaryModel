let cl = console.log;


const  showModel = document.getElementById('showModel');
const  backdrop = document.getElementById('backdrop');
const  myModel = document.getElementById('myModel');
const HideModel = document.querySelectorAll('.HideModel');
const AddMovieBtn = document.getElementById('AddMovieBtn');
const updateMovieBtn = document.getElementById('updateMovieBtn');
const movieForm = document.getElementById('movieForm')
const title = document.getElementById('title');
const url = document.getElementById('url');
const rating = document.getElementById('rating');
const moviecontainer = document.getElementById('moviecontainer')

const hidemodelArr = Array.from(HideModel);


let movieArr = [];

let baseurl = `http://localhost:3000`;

localStorage.setItem('token', 'Brear Token: qwertYuiop')
const makeApiCall = (methodname, url, body) =>{
    return new Promise((resolve, reject) =>{
        let xhr = new XMLHttpRequest();
        xhr.open(methodname, url);
        xhr.setRequestHeader("content-type","application/json; charset=UTF-8");
        xhr.setRequestHeader( "authrazation" , localStorage.getItem('token'));
        // headers:{
        //     "content-type":"application/json; charset=UTF-8",
        //     // authrazation : "Bearer Token qwertYuiop",
        //     authrazation : localStorage.getItem('token'),
    
        //   }
        xhr.onload = function(){
            if(xhr.status === 200 || xhr.status === 201){
                resolve(xhr.response)
            }else{
                reject('something went wrong')
            }
        }
        xhr.send(body)
    })

}

let getUrl = `${baseurl}/moviesInfo`;
makeApiCall('GET', getUrl)
                    .then(res =>{
                        // cl(res);
                        movieArr = JSON.parse(res);
                        templating(movieArr)
                    })
                    .catch(cl)


const clickmodelhandler = (event) =>{
    backdrop.classList.toggle('show');
    myModel.classList.toggle('show');
}
function onShowHandler(e) {
    clickmodelhandler();
}

const onsubmitHandler = (ele) =>{
    ele.preventDefault();
    cl('event clicked')

    let obj = {
        imgUrl : url.value,
        imgTitle : title.value,
        imgRating : rating.value
    }
    cl(obj);      
    clickmodelhandler();

    let submitUrl = `${baseurl}/moviesInfo`;
    makeApiCall('POST', submitUrl, JSON.stringify(obj))
                                                    .then(res =>{
                                                        movieArr.push(obj); 
                                                        templating(movieArr)
                                                    })
                                                    .catch(cl)
     ele.target.reset();
    
}

const onEditHandler = (ele) =>{
    let getId = ele.dataset.id;
    localStorage.setItem('setId', getId);

    let editUrl = `${baseurl}/moviesInfo/${getId}`;

    makeApiCall('GET', editUrl)
                        .then(res =>{
                            let obj = JSON.parse(res);
                            title.value = obj.imgTitle;
                            url.value = obj.imgUrl;
                            rating.value = obj.imgRating;
                            updateMovieBtn.classList.remove('d-none');
                            AddMovieBtn.classList.add('d-none')
                        })
    
    onShowHandler()
}
const onupdateHandler = (eve) =>{
    let getId = localStorage.getItem('setId');
    let updateUrl =  `${baseurl}/moviesInfo/${getId}`;

    let obj = {
        imgTitle : title.value,
        imgUrl : url.value,
        imgRating : rating.value
    }

    makeApiCall('PATCH', updateUrl, JSON.stringify(obj))
                                .then(cl)
                                .catch(cl)

     updateMovieBtn.classList.add('d-none');
   AddMovieBtn.classList.remove('d-none')
}

const ondeleteHandler = (ele) =>{
    let getId = ele.dataset.id;
    let deleteUrl = `${baseurl}/moviesInfo/${getId}`;

    makeApiCall("DELETE", deleteUrl)
                                    .then(cl)
                                    .catch(cl)
}
hidemodelArr.forEach(ele =>{
    ele.addEventListener('click', clickmodelhandler)
})

const templating = (array) =>{
    let result = "";

    array.forEach(ele =>{
        result += `            
            <div class="col-md-4">
                <div class="card movieCard" >
                    <div class="card-body">
                        <figure>
                            <div class="movieImg">
                                 <img src="${ele.imgUrl}" alt="" class="img-fluid">
                            </div>                         
                            <figcaption>
                                <h2 class="title">${ele.imgTitle}</h2>
                                <h6 class="rating">${ele.imgRating}/5</h6>
                            </figcaption>
                            <div class="text-right">
                                <button class="btn btn-info" data-id="${ele.id}"  onclick="onEditHandler(this)">Edit</button>
                                <button class="btn btn-danger" data-id="${ele.id}" onclick="ondeleteHandler(this)">Delete</button>
                            </div>                          
                        </figure>
                    </div>
                </div>
            </div>              
        `
    })

    moviecontainer.innerHTML = result;
}

backdrop.addEventListener('click', clickmodelhandler)
showModel.addEventListener('click', onShowHandler)
// AddMovieBtn.addEventListener('click', onaddHandler);
movieForm.addEventListener('submit', onsubmitHandler);
updateMovieBtn.addEventListener('click', onupdateHandler)
