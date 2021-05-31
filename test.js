// /function funcScope() {

    // if(true) {
    // var firstName = "Thomas"

    // let lastName = "Eruchie"

   // }
    // console.log("The scope acess is :"  , firstName);
   //  console.log("The scope acess is :"  , lastName);
    
//}
//funcScope();
//const nickName = [2,4,6];
//nickName.push(8);
 // console.log("The scope acess is :"  ,nickName);


//  let firstName = "Thomas";
// let lastName = "Eruchie";
 //let fullName = `${firstName} ${lastName} `;
//  console.log(fullName);




 
// let searchResults = 50;
//let output = `${searchResults > 0 ? `${searchResults} Results` : "Noresults"}`

//console.log(output);

//let searchResultss = 5;
//let outputs = `${searchResultss == 0 ? 'No results' : searchResultss == 5 ? `5 results` : `${searchResultss} Results`}`
//console.log(outputs);



// function getFullname(){
//     let firstName = "Thomas"
//     let lastName = "Eruchie"

//     return `${firstName} ${lastName}`;
// }

// let fullName = getFullname();
// console.log(fullName);


// func = (firstName,lastName)=>{return `${firstName} ${lastName}`}

// let output = func('Thomas', 'Eruchie');
// console.log(output);

// DEFAULT PARRAMETERS

// getParam=(ext1 ="Name" , ext2)=>console.log("The defaults Parameter is :", ext1); 
// getParam();

// getParam=(ext1 ="Name" , ext2)=>{return `The default parameter is : ${ext1}`}
// let output = getParam();
// console.log(output);


//ITTERATING OVER ARRAY AND OBJECTS

// looping through an array of fruits

let fruits = ["Apple","Bannana","orange","Mango","Guava"];


//old method

// for(let index = 0; index < fruits.length; index++){
//     console.log(fruits[index]);
// }


// Using value of method

// for(let value of fruits){
//     console.log(value);
// }

//using foreach method does not have return value

// fruits.forEach((value)=>{console.log(value)
// })

// Using Map function has return value capability
//Also using filter function in map to filter out an item in the list

// newFruits=fruits.map((fruit)=>{return fruit;

// }).filter((value)=>  {if(value == "orange"){
//     return false
// }
// else{
//     return true;
// }

// })
// console.log(newFruits);

//OBJECT DECONSTRUCTION

// First sample

// let fullName = {
//     firstName: "John",
//     lastName : "Wick"
// }

//Old ways
// let  fname = fullName.firstName;
// let lname = fullName.lastName;

//THIS IS OBJECT DECINSTRUCTING
// const {firstName, lastName} = fullName;
// console.log(firstName, lastName);

// 2ND METHOD IS ARRAY DECONSTRUCTING

// let user = [
//     {
        
//     firstName: "John", 
//     lastName: "Wick"
// },
// (user)=>console.log("We are the Ultimate :", user)



// ]

// let [newUser,setUser] = user;
// console.log(newUser);
// setUser({firstName : "Super" , lastName : "Great"});


// PROMISES ENEBLAES US TO RUN FUTURE CODE IN ASYNC WHEN SOME OTHER TASK IS COMPLETED

// let promise = new Promise((resolve, reject) => {
//     setTimeout(() =>{
//         resolve({
//             firstName : "John",
//             lastName  : "Wick"
//         });
//     }, 1000)
// })

// promise.then((response) =>{
//     let alert = prompt("What task is being run today?")
//     console.log(alert);
//     console.log(response);
// })

// console.log("This is part 1");

// I WANT TO DO ERROR HANDLING IN THIS CODE USING reject


// let promise = new Promise((resolve, reject) => {
//     setTimeout(() =>{
//         // resolve({
//         //     firstName : "John",
//         //     lastName  : "Wick"
//         // });
//         reject("The task has been cancelled");
//     }, 1000)
// })

// promise.then((response) =>{
//     let alert = prompt("What task is being run today?")
//     console.log(alert);
//     console.log(response);
// }).catch((error) =>{
//     console.log(error);
// })

// console.log("This is part 1");

// FETCHING DATA FROM API WITH PROMISES(AJAX)

// let userData = fetch("https://randomuser.me/api/");
// console.log(userData);

// userData.then((response) => {
//     return response.json();
// }).then((resData) =>{

//     console.log(resData.results[0].name.first);
//     console.log(resData.results[0].name.last);

// })

// .catch((error) =>{
//     console.log(error);

// })


let user = fetch("https://randomuser.me/api/");


user.then((response) => {
    return response.json();
}).then((resData) => {
    console.log(resData.results[0].name.first);
    console.log(resData.results[0].name.last);
    
}).catch((error) => {
    console.log(error);
})






















































