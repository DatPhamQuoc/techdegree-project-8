const table = document.querySelectorAll('TABLE')[0];
const books = document.querySelectorAll("TBODY TR");
const numberOfPage = Math.ceil((books.length-1)/5);
const ul = document.createElement('ul')
let li='';


books.forEach((book, index) =>  {
  if(index > 4) {
    book.style.display = 'none'
  }
})

for(let i=1; i<= numberOfPage; i++){
  li +=`<li><a>${i}</a></li>`
}


ul.innerHTML = li
table.appendChild(ul)

ul.addEventListener("click", (e) => {
  if(e.target.tagName == "A"){
    books.forEach((book, index) => {
      if(index > (parseInt(e.target.innerHTML)-1)*5 &&
          index <= parseInt(e.target.innerHTML)*5){
        book.style.display = ''
      } else {
        book.style.display = 'none'
      }
    })
  }
})
