function toggleCheckBox() {
    let span = document.querySelectorAll('.filter-check_checkmark');
    span.forEach(item => {
        item.addEventListener('click', function () {
            if (!this.previousElementSibling.checked) this.classList.add('checked')
            else this.classList.remove('checked')
        })
    })
}

function toggleCart() {
    let btnCard = document.querySelector('#cart');
    let modalCart = document.querySelector('.cart');
    let btnClose = document.querySelector('.cart-close')
    btnCard.addEventListener('click', function () {
        modalCart.style.display = 'flex'
    })
    btnClose.addEventListener('click', function () {
        modalCart.style.display = 'none';
    })
}

function workCart() {
    let cards = document.querySelectorAll('.goods .card');
    let cartWrapper = document.querySelector('.cart-wrapper');
    let cartEmpty = document.querySelector('#cart-empty');
    let countGoods = document.querySelector('.counter')
    cards.forEach(item => {
        let btn = item.querySelector('button')
        btn.addEventListener('click', () => {
            let cardClone = item.cloneNode(true)
            cartWrapper.appendChild(cardClone);
            showData();
            let removeBtn = cardClone.querySelector('button')
            removeBtn.innerHTML = 'Удалить из корзины';
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                showData()
            });
        })
    })

    function showData() {
        let cardsCart = cartWrapper.querySelectorAll('.card').length;
        let cardsPrice = cartWrapper.querySelectorAll('.card-price')
        let cardTotal = document.querySelector('.cart-total span')
        let sum = 0;
        countGoods.innerHTML = cardsCart
        cardsPrice.forEach(item => {
            let price = parseFloat(item.innerHTML)
            sum += price
        });
        cardTotal.innerHTML = sum
        cardsCart !== 0 ? cartEmpty.remove() : cartWrapper.appendChild(cartEmpty)
    }
}

function actionPage() {
    let cards = document.querySelectorAll('.goods .card');
    let saleSpan = document.querySelector('.filter-check_checkmark');
    let min = document.querySelector('#min')
    let max = document.querySelector('#max')
    let goods = document.querySelector('.goods')
    let search = document.querySelector('.search-wrapper_input')
    let searchBtn = document.querySelector('.search-btn')
    saleSpan.addEventListener('click', () => {
        cards.forEach(item => {
            if (!saleSpan.previousElementSibling.checked) {
                if (!item.querySelector('.card-sale')) {
                    item.parentNode.style.display = 'none'
                }
            } else {
                item.parentNode.style.display = '';
            }
        })
    });

    function filterPrice() {
        cards.forEach(item => {
            let cardPrice = item.querySelector('.card-price')
            let price = parseFloat(cardPrice.textContent)
            if ((min.value && price < min.value) || (max.value && price > max.value)) {
                item.parentNode.remove()
            } else {
                goods.appendChild(item.parentNode)
            }
        })
    }
    min, addEventListener('change', filterPrice)
    max, addEventListener('change', filterPrice)
    searchBtn.addEventListener('click', () => {
        let searchText = new RegExp(search.value.trim(), 'i')
        cards.forEach(item => {
            let title = item.querySelector('.card-title');
            if (!searchText.test(title.textContent)) {
                item.parentNode.style.display = 'none';
            } else {
                item.parentElement.style.display = ''
            }
        })
    })
}

function getData() {
    let goodsWrapper = document.querySelector('.goods')
    return fetch("db.json").then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Данные не были полученн, ошибка: ' + res.status)
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.warn(err)
            goodsWrapper.innerHTML = '<div>Упс что-то пошло не так!</div>'
        });
}

function renderCards(data) {
    let goodsWrapper = document.querySelector('.goods')
    data.goods.forEach(item => {
        let card = document.createElement('div')
        card.className = "col-12 col-md-6 col-lg-4 col-xl-3"
        card.innerHTML = `
    <div class="card" data-category = "${item.category}">
        ${item.sale ? `<div class="card-sale">🔥Hot Sale🔥</div>` : ''}
        <div class="card-img-wrapper">
            <span class="card-img-top"
                style="background-image: url('${item.img}')"></span>
        </div>
        <div class="card-body justify-content-between">
            <div class="card-price" style = "${item.sale ? 'color : red' : ''}">${item.price} ₽</div>
            <h5 class="card-title">${item.title}</h5>
            <button class="btn btn-primary">В корзину</button>
        </div>
    </div>
    `;
        goodsWrapper.appendChild(card)
    });
}

function renderCatalog() {
    let cards = document.querySelectorAll('.goods .card');
    let catalogList = document.querySelector('.catalog-list')
    let catalogBtn = document.querySelector('.catalog-button')
    let catalogWrapper = document.querySelector('.catalog')
    let catalog = new Set();
    cards.forEach(item => {
        catalog.add(item.dataset.category)
    })
    catalog.forEach(item => {
        let li = document.createElement('li')
        li.textContent = item
        catalogList.appendChild(li);
    })
    catalogBtn.addEventListener('click', (event) => {
        if (catalogWrapper.style.display) {
            catalogWrapper.style.display = ''
        } else {
            catalogWrapper.style.display = 'block'
        }
        if (event.target.tagName === 'LI') {
            cards.forEach(item => {
                if (item.dataset.category === event.target.textContent) {
                    item.parentNode.style.display = ''
                } else {
                    item.parentNode.style.display = 'none'
                }
            })
        }
    });
}

getData().then(data => {
    renderCards(data)
    toggleCheckBox();
    toggleCart();
    workCart();
    actionPage();
    renderCatalog();
});
