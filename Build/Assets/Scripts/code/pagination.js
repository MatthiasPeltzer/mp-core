document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 10; // Anzahl der Elemente pro Seite

  const lists = document.querySelectorAll(".paginated-list");

  lists.forEach((listContainer) => {
    const itemList = listContainer.querySelector("ul");
    const paginationControls = listContainer.querySelector(".pagination-controls");
    const items = Array.from(itemList.children);

    let currentPage = 1;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Funktion zum Rendern einer Seite
    function renderPage(page, focusFirstItem = false) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      // Zeigt nur die relevanten Listenelemente an
      items.forEach((item, index) => {
        item.style.display = index >= start && index < end ? "block" : "none";
      });

      // Falls erforderlich, Fokus auf den ersten Link im ersten sichtbaren Listenelement setzen
      if (focusFirstItem) {
        const firstVisibleItem = items[start];
        if (firstVisibleItem) {
          const link = firstVisibleItem.querySelector("a");
          if (link) {
            link.focus();
          }
        }
      }

      renderPaginationControls(page);
    }

    // Funktion zur Erstellung der Paginierungs-Steuerelemente
    function renderPaginationControls(page) {
      paginationControls.innerHTML = ""; // Alte Buttons entfernen

      if (totalPages > 1) {
        const paginationList = document.createElement("ul");
        paginationList.className = "pagination";

        // "Seite zurück"-Button
        const prevItem = document.createElement("li");
        prevItem.className = "page-item";
        if (page === 1) {
          prevItem.classList.add("disabled");
        }
        const prevButton = document.createElement("button");
        prevButton.className = "page-link";
        prevButton.textContent = "Previous";
        prevButton.disabled = page === 1;
        prevButton.addEventListener("click", () => {
          if (page > 1) {
            currentPage--;
            renderPage(currentPage, true);
          }
        });
        prevItem.appendChild(prevButton);
        paginationList.appendChild(prevItem);

        // Seiten-Buttons
        for (let i = 1; i <= totalPages; i++) {
          const listItem = document.createElement("li");
          listItem.className = "page-item";

          if (i === page) {
            listItem.classList.add("active");
            listItem.setAttribute("aria-current", "page");
          }

          const button = document.createElement("button");
          button.textContent = "" + i;
          button.className = "page-link";
          button.disabled = i === page;

          if (button.disabled) {
            listItem.classList.add("disabled");
          }

          button.addEventListener("click", () => {
            currentPage = i;
            renderPage(currentPage, true);
          });

          listItem.appendChild(button);
          paginationList.appendChild(listItem);
        }

        // "Seite vor"-Button
        const nextItem = document.createElement("li");
        nextItem.className = "page-item";
        if (page === totalPages) {
          nextItem.classList.add("disabled");
        }
        const nextButton = document.createElement("button");
        nextButton.className = "page-link";
        nextButton.textContent = "Next";
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener("click", () => {
          if (page < totalPages) {
            currentPage++;
            renderPage(currentPage, true);
          }
        });
        nextItem.appendChild(nextButton);
        paginationList.appendChild(nextItem);

        paginationControls.appendChild(paginationList);
      }
    }

    // Initiale Anzeige der ersten Seite ohne Fokussetzung
    renderPage(currentPage, false);
  });
});
