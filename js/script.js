const books = [];
let filteredBooks = [];
const RENDER_BOOKS_EVENT = "render-books";
const SEARCH_BOOKS_EVENT = "search-books";
const STORAGE_KEY = "BOOKS_APPS";

/**
 * EVENTS:
 * - Document when DOM loaded
 * - Custom Event: Render Books Event
 * - Custom Event: Search Books Event
 */

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist) {
    loadBooksFromStorage();
  }

  /**
   * Create or Update Book when Input Book Form is Submitted
   */
  document.getElementById("inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookID = document.getElementById("inputBookId");
    bookID.value ? updateBook() : createBook();
  });

  /**
   * Search Book when Search Book Form is Submitted
   */
  document.getElementById("searchBook").addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });
});

document.addEventListener(RENDER_BOOKS_EVENT, () => {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completedBook = document.getElementById("completeBookshelfList");
  completedBook.innerHTML = "";

  books.forEach((book) => {
    const bookElement = makeBook(book);
    book.isBookCompleted
      ? completedBook.append(bookElement)
      : incompleteBook.append(bookElement);
  });

  saveBooksToStorage();
});

document.addEventListener(SEARCH_BOOKS_EVENT, () => {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completedBook = document.getElementById("completeBookshelfList");
  completedBook.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = makeBook(book);
    book.isBookCompleted
      ? completedBook.append(bookElement)
      : incompleteBook.append(bookElement);
  });
});

/**
 * CRUD OPERATION:
 * - Create Book
 * - Edit Book
 * - Update Book
 * - Delete Book
 * - Toggle Book
 * - Search Book
 * - Save Book to Storage
 * - Load Book from Storage
 *
 * TODO: Refactor to OOP.
 */

const createBook = () => {
  const { title, author, year, isBookCompleted } = getInputBookForm();

  const book = {
    id: generateID(),
    title,
    author,
    year,
    isBookCompleted,
  };

  books.push(book);
  dispatchEvent(RENDER_BOOKS_EVENT);
};

const editBook = (bookId) => {
  const book = books.find((book) => book.id === bookId);

  document.getElementById("inputBookId").value = book.id;
  document.getElementById("inputBookTitle").value = book.title;
  document.getElementById("inputBookAuthor").value = book.author;
  document.getElementById("inputBookYear").value = book.year;
  document.getElementById("inputBookIsComplete").checked = book.isBookCompleted;
  document.getElementById("bookSubmit").innerText = "Edit Book";
};

const updateBook = () => {
  const { form, id, title, author, year, isBookCompleted, button } =
    getInputBookForm();

  const index = books.findIndex((book) => book.id === parseInt(id));
  books[index] = {
    ...books[index],
    title,
    author,
    year,
    isBookCompleted,
  };

  dispatchEvent(RENDER_BOOKS_EVENT);
  form.reset();
  button.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
};

const deleteBook = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books.splice(bookIndex, 1);
  dispatchEvent(RENDER_BOOKS_EVENT);
};

const toggleBook = (id) => {
  const book = books.find((book) => book.id === id);
  book.isBookCompleted = !book.isBookCompleted;
  dispatchEvent(RENDER_BOOKS_EVENT);
};

const searchBook = () => {
  const keyword = document.getElementById("searchBookTitle").value;
  const filtered = books.filter((book) => book.title === keyword);
  filteredBooks = [...filtered];
  dispatchEvent(SEARCH_BOOKS_EVENT);
};

const saveBooksToStorage = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const loadBooksFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  data && books.push(...data);
  dispatchEvent(RENDER_BOOKS_EVENT);
};

/**
 * UI:
 * - Render UI Book
 */

const makeBook = (book) => {
  // CREATE TITLE, AUTHOR, YEAR ELEMENT
  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = book.author;

  const year = document.createElement("p");
  year.innerText = book.year;

  // CREATE ACTION CONTAINER FOR BUTTONS
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("action");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus Buku";

  deleteButton.addEventListener("click", () => {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.classList.add("blue");
  editButton.innerHTML = "Edit Buku";

  editButton.addEventListener("click", () => {
    editBook(book.id);
  });

  if (book.isBookCompleted) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("green");
    unreadButton.innerText = "Belum selesai dibaca";

    unreadButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    buttonsContainer.append(unreadButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("green");
    readButton.innerHTML = "Selesai Dibaca";

    readButton.addEventListener("click", () => {
      toggleBook(book.id);
    });

    buttonsContainer.append(readButton);
  }

  buttonsContainer.append(deleteButton, editButton);

  // ADD BOOK to CONTAINER
  const bookItemContainer = document.createElement("article");
  bookItemContainer.classList.add("book_item");
  bookItemContainer.append(title, author, year, buttonsContainer);

  return bookItemContainer;
};

/**
 * Utility Function:
 * - Get Input Book Form
 * - Dispatch Event by Name
 * - Generate ID
 * - Check Storage Exist
 */

const getInputBookForm = () => {
  const form = document.getElementById("inputBook");
  const id = document.getElementById("inputBookId").value;
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isBookCompleted = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const button = document.getElementById("bookSubmit");

  return {
    form,
    id,
    title,
    author,
    year,
    isBookCompleted,
    button,
  };
};

const dispatchEvent = (name) => {
  document.dispatchEvent(new Event(name));
};

const generateID = () => +new Date();

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    return false;
  }
  return true;
};
