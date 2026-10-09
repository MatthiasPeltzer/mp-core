import { asHTMLElement } from './Utils/domTypes.js'

const CONFIG = {
  itemsPerPage: 10,
  containerSelector: '.paginated-list',
  listSelector: 'ul',
  controlsSelector: '.pagination-controls',
} as const

function createPagination(listContainer: HTMLElement): void {
  const itemList = listContainer.querySelector(CONFIG.listSelector)
  const paginationControls = listContainer.querySelector(CONFIG.controlsSelector)

  if (!(itemList instanceof HTMLElement) || !(paginationControls instanceof HTMLElement)) {
    return
  }

  const controlsEl = paginationControls
  const items = [...itemList.children].filter((node): node is HTMLElement => node instanceof HTMLElement)
  const totalPages = Math.ceil(items.length / CONFIG.itemsPerPage)
  let currentPage = 1

  function renderPage(page: number, focusFirstItem = false): void {
    const start = (page - 1) * CONFIG.itemsPerPage
    const end = start + CONFIG.itemsPerPage

    items.forEach((item, index) => {
      item.style.display = index >= start && index < end ? 'block' : 'none'
    })

    if (focusFirstItem && items[start]) {
      const link = items[start].querySelector('a')
      if (link instanceof HTMLElement) {
        link.focus()
      }
    }

    renderControls(page)
  }

  function createButton(text: string, disabled: boolean, onClick: () => void): HTMLLIElement {
    const listItem = document.createElement('li')
    listItem.className = 'page-item'
    if (disabled) {
      listItem.classList.add('disabled')
    }

    const button = document.createElement('button')
    button.className = 'page-link'
    button.textContent = text
    button.disabled = disabled
    button.addEventListener('click', onClick)

    listItem.appendChild(button)
    return listItem
  }

  function renderControls(page: number): void {
    controlsEl.innerHTML = ''

    if (totalPages <= 1) {
      return
    }

    const paginationList = document.createElement('ul')
    paginationList.className = 'pagination'

    paginationList.appendChild(
      createButton('Previous', page === 1, () => {
        if (page > 1) {
          currentPage -= 1
          renderPage(currentPage, true)
        }
      }),
    )

    for (let i = 1; i <= totalPages; i += 1) {
      const isCurrentPage = i === page
      const pageItem = createButton(String(i), isCurrentPage, () => {
        currentPage = i
        renderPage(currentPage, true)
      })

      if (isCurrentPage) {
        pageItem.classList.add('active')
        pageItem.setAttribute('aria-current', 'page')
      }

      paginationList.appendChild(pageItem)
    }

    paginationList.appendChild(
      createButton('Next', page === totalPages, () => {
        if (page < totalPages) {
          currentPage += 1
          renderPage(currentPage, true)
        }
      }),
    )

    controlsEl.appendChild(paginationList)
  }

  renderPage(currentPage, false)
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(CONFIG.containerSelector).forEach((node) => {
    const listContainer = asHTMLElement(node)
    if (listContainer) {
      createPagination(listContainer)
    }
  })
})
