const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const INCOMPLETED_LIST_BOOK_ID = 'incompleteBookshelfList';
const COMPLETED_LIST_BOOK_ID = 'completeBookshelfList';
const BOOK_ITEMID = 'itemId';

document.addEventListener(RENDER_EVENT, function() {
  console.log(books);
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    // class belum dibuat
    loadDataFromStorage();
  }
 });

 function addBook() {

   const BookTitle = document.getElementById('inputBookTitle').value;
   const BookAuthor = document.getElementById('inputBookAuthor').value;
   const BookYear = document.getElementById('inputBookYear').value;
   const isComplete = document.getElementById('inputBookIsComplete').checked;

   const generatedID = generateId();
   const BookObject = generateBookObject(generatedID, BookTitle, BookAuthor, BookYear, isComplete);
     books.push(BookObject);

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData(); 
  }

  function generateId() {
    return +new Date();
  }

 function generateBookObject(id, title, author, year, isCompleted) {
   return {
     id,
     title,
     author,
     year,
     isCompleted
   }
  }

function makeBook(BookObject) {
  const BookTitle = document.createElement('h2');
  BookTitle.innerText = BookObject.title;
 
  const BookAuthor = document.createElement('p');
  BookAuthor.innerText = BookObject.author;

  const BookYear = document.createElement('p');
  BookYear.innerText = BookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('inner');
  buttonContainer.append(BookTitle, BookAuthor, BookYear);
 
  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(buttonContainer);
  container.setAttribute('id', `book-${BookObject.id}`);

  if (BookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(BookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(BookObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addBookToCompleted(BookObject.id);
    });
    
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function() {
      removeBookFromCompleted(BookObject.id);
    });
    container.append(checkButton, trashButton);
  }
 
  return container;
}
    
const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
  check = true;

  document.querySelector('span').innerText = 'SELESAI DIBACA';
}else {
  check = false;

  document.querySelector('span').innerText = 'BELUM SELESAI DIBACA';
}
});

document.getElementById('searchBook').addEventListener('submit', function (event) {
event.preventDefault();
const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
const bookList = document.querySelectorAll('.item > .inner h2');

/*Bagian Ini Masih agak Bermasalah*/
for (const book of bookList) {
  if (searchBook !== book.innerText.toLowerCase()) {
    book.parentElement.style.display = 'block';
  } else {
    book.parentElement.style.display = 'none';
  }
}
});

/*Tahan sampai sini dulu boy*/
document.addEventListener(RENDER_EVENT, function () {
  const incompletedBOOKList = document.getElementById('incompleteBookshelfList');
  incompletedBOOKList.innerHTML = '';

const completedBOOKList = document.getElementById('completeBookshelfList');
  completedBOOKList.innerHTML = '';  
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
    incompletedBOOKList.append(bookElement);
    else
    completedBOOKList.append(bookElement);
  }
});

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return; 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function saveData(){
  if (isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(RENDER_EVENT))
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT,function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serialData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serialData)
  if(data !== null){
    for (const book of data){
    books.push(book)
  }
  }
  document.dispatchEvent (new Event(RENDER_EVENT));
}