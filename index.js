(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  //增加兩個btn變數
  const cardView = document.getElementById('card-veiew')
  const listView = document.getElementById('list-veiew')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    // displayDataList(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    //console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  //主要改變如下
  cardView.addEventListener('click', event => {
    getPageData(pageNumber, data)
  })

  listView.addEventListener('click', event => {
    console.log(typeof pageNumber)
    if (typeof pageNumber !== 'undefined') {
      getPageData2(pageNumber, data)
    }
    else { getPageData2(1, data) }
  })

  function getPageData2(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList2(pageData)
  }

  //list view的innerHTML
  function displayDataList2(data) {
    let htmlContent = '<div id = "listView" class="d-flex flex-column container mt-5">'
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="form-inline">        
          <h6>${item.title}</h6> 
          <button class="ml-auto btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More </button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></h6>    
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }
  // listen to pagination click event; 增加了listView條件抓取判斷
  pagination.addEventListener('click', event => {
    pageNumber = event.target.dataset.page
    if (document.getElementById('listView')) {
      getPageData2(event.target.dataset.page)
    }
    else {
      if (event.target.tagName === 'A') {
        getPageData(event.target.dataset.page)
      }
    }
  })

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    //console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      //console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
})()
