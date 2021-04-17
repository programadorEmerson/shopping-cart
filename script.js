let items; // Esta variável guarda os itens exibidos na tela;
let orderedList; // Esta variável guarda a OL;
let buttonClearAll;
let totalPrice = 0;

const convertToBrl = (valor) => (
  valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
);
const convertToFloat = (valor) => (
  valor.replace('.', '').replace(',', '.').replace('Valor: R$ ', '')
);

async function amountValue() {
  let priceItem = 0;
  let qtdadeItem = 0;
  const qtdadeItemCarrinho = document.querySelector('.qtdadeItem');
  const itemCarrinho = document.querySelectorAll('.cart__item');
  itemCarrinho.forEach((item) => {
    const value = convertToFloat(item.querySelector('.secItemSideA').lastChild.innerText);
    priceItem += parseFloat(value);
    qtdadeItem += 1;
  });
  totalPrice.innerText = `Total: ${convertToBrl(priceItem)}`;
  qtdadeItemCarrinho.innerText = `${qtdadeItem} ${qtdadeItem > 1 ? 'Itens' : 'Item'}`;
}

function addLocalHistorage() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('projectCart', listItems.innerHTML);  
}

  function createElement(element, className, atributeType, atrubute) {
    const elemento = document.createElement(element);
    elemento.className = className;
    elemento.setAttribute(atributeType, atrubute);
    return elemento;
  }

 function cartItemClickListener(event) {
   const itemCart = event.target;
   orderedList.removeChild(itemCart);
   amountValue();
 }

 function createCartItemElement({ sku, name, salePrice, thumbnail }) {
   const sectionA = createElement('section', 'secItemSideA', 'id', 'none');
   const sectionB = createElement('section', 'secItemSideB', 'id', 'none');
   const pCodigo = document.createElement('p');
   pCodigo.innerText = `Cód: ${sku}`;
   const pImg = createElement('img', 'imagemProduto', 'src', thumbnail);
   const pDescricao = document.createElement('p');
   pDescricao.innerText = `Produto: ${name}`;
   const pValor = createElement('p', 'valorItem', 'id', 'none');
   pValor.innerText = `Valor: ${convertToBrl(salePrice)}`;
   sectionA.appendChild(pCodigo);
   sectionA.appendChild(pDescricao);
   sectionA.appendChild(pValor);
   sectionB.appendChild(pImg);
   const elementLi = createElement('li', 'cart__item', 'id', 'none');
   elementLi.appendChild(sectionA);
   elementLi.appendChild(sectionB);
   elementLi.addEventListener('click', cartItemClickListener);
   return elementLi;
 }

const addProductToCart = (args) => {    
  fetch(`https://api.mercadolibre.com/items/${args}`)
  .then(
    (response) => {
      response.json().then((result) => {
    const resultado = result;
    const newItem = createCartItemElement({
      sku: resultado.id,
      name: resultado.title,
      salePrice: resultado.price,
      thumbnail: resultado.thumbnail,
    });
    orderedList.appendChild(newItem);
    addLocalHistorage();
    amountValue();
    alert(`${resultado.title} adicionado ao carrinho`);
  });
    },
  );
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const removeAllItemsLocalHistorage = () => {
  const itemCarrinho = document.querySelectorAll('.cart__item');
  if (itemCarrinho) {
    itemCarrinho.forEach((item) => {
    orderedList.removeChild(item);
  });
  localStorage.removeItem('projectCart');
  amountValue();
  }
};

const clickAddEvent = () => {
  // Busca com base na classe .item todos os itens
  items.addEventListener('click', function (props) {
    // parentNode retorna o pai do elemento clicado, no caso o pai do botão adicionar
    const sku = getSkuFromProductItem(props.target.parentNode);
    addProductToCart(sku);
  });
  buttonClearAll.addEventListener('click', function () {
    // Botão de limpar a lista de carrinho
    removeAllItemsLocalHistorage();
  });
};

function recoveredItensLocalStorage() {
  const itemLocalHistorage = localStorage.getItem('projectCart');
  if (itemLocalHistorage) {
    orderedList.innerHTML = itemLocalHistorage;
    amountValue();
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = document.createElement('button');
  button.className = 'item__add';
  button.innerText = 'Adicionar ao carrinho!';

  const elementAwsome = document.createElement('i');
  elementAwsome.className = 'fas fa-cart-plus';

  section.appendChild(button);
  button.appendChild(elementAwsome);
  return section;
}

const createLoading = () => {
  const containnerResult = document.querySelector('.container');
  const elementHeader = document.createElement('div');
  elementHeader.className = 'loading';
  containnerResult.appendChild(elementHeader);
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  const containnerResult = document.querySelector('.container');
  containnerResult.removeChild(loading);
};

// Função para retornar o produto com base no parâmetro
const recoverProduct = async (product) => {  
  items = document.querySelector('.items');
  orderedList = document.querySelector('.cart__items');
  buttonClearAll = document.querySelector('.empty-cart');
  totalPrice = document.querySelector('.amountCart');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
    (response) => {
      response.json().then((result) => {
        const resultado = result.results;
        resultado.forEach((element) => {         
          items.appendChild(createProductItemElement(element));
        });     
          // Após criar os elementos na tela, aciona a função que cria o evento de clique
          clickAddEvent();
      });
      removeLoading();
    },
  );
};

function scriptModal() {
  const modal = document.getElementById('myModal');
  const btn = document.getElementById('myBtn');
  const span = document.getElementsByClassName('close')[0];
  btn.onclick = function () {
    modal.style.display = 'block';
  };

  span.onclick = function () {
    modal.style.display = 'none';
  };
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

window.onload = function onload() {  
  createLoading();
  recoverProduct('computador');
  recoveredItensLocalStorage();
  scriptModal();
};
