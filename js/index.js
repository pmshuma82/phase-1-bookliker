document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
  
    // Load books on page load
    loadBooks();
  
    // Function to load books
    function loadBooks() {
      fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => renderBooks(books))
        .catch(error => console.error("Error loading books:", error));
    }
  
    // Function to render books in list
    function renderBooks(books) {
      list.innerHTML = ""; // Clear previous content
      books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        list.appendChild(li);
      });
    }
  
    // Function to show book details
    function showBookDetails(book) {
      showPanel.innerHTML = ""; // Clear previous content
      const thumbnail = document.createElement("img");
      thumbnail.src = book.thumbnailUrl;
      const description = document.createElement("p");
      description.textContent = book.description;
      const likes = document.createElement("ul");
      book.users.forEach(user => {
        const userLi = document.createElement("li");
        userLi.textContent = user.username;
        likes.appendChild(userLi);
      });
      const likeButton = document.createElement("button");
      likeButton.textContent = "Like";
      likeButton.addEventListener("click", () => likeBook(book));
      showPanel.appendChild(thumbnail);
      showPanel.appendChild(description);
      showPanel.appendChild(likes);
      showPanel.appendChild(likeButton);
    }
  
    // Function to like/unlike book
    function likeBook(book) {
      const userId = 1; // Replace with actual user ID
      const userLiked = book.users.some(user => user.id === userId);
      const updatedUsers = userLiked ? book.users.filter(user => user.id !== userId) : [...book.users, { id: userId, username: "pouros" }];
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ users: updatedUsers })
      })
      .then(() => showBookDetails(book)) // Reload book details after successful update
      .catch(error => console.error("Error updating book:", error));
    }
  });
  