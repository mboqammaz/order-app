import { menuArray } from './data.js';

const menuItems = document.getElementById('menu-items');
const checkoutList = document.getElementById('checkout-list');
const orderDetails = document.getElementById('order-details');
const cardPopup = document.getElementById('card-popup')
const completeOrder = document.getElementById('complete-order');
const cardDetails = document.getElementById('card-details')

const addedItems = [];

completeOrder.addEventListener('click', () => {
    cardPopup.style.display = 'inline'
})

document.getElementById('close-btn').addEventListener('click', () => {
    cardPopup.style.display = 'none'
})


const showMenu = menuArray.map(item=>{
        const {
            name, 
            ingredients, 
            id, 
            price, 
            emoji 
        } = item


        return `
        <div class="item">
    
            <div class="item-img">
                <p>${emoji}</p>
            </div>
    
            <div class="item-details">                
                <h2 class="item-title" id="item-name">${name}</h2>
                <h4 class="item-description">${ingredients.join(', ')}</h4>
                <h3 class="item-price" id="item-price">$${price}</h3>
            </div>
    
            <div class='add-btn' id="add-btn">
                <i class="fa-regular fa-plus" data-add="${id}"></i>
            </div>
    
        </div>

        <hr class="solid">`
    }).join('')

menuItems.innerHTML += showMenu




// Target the buttons
document.addEventListener('click', e => {
    const itemToAdd = e.target.dataset.add;

    if (itemToAdd) {
        const menuItemObj = menuArray.find(menuItem => menuItem.id == itemToAdd);

        if (menuItemObj){
            const existingItem = addedItems.find(addedItem => addedItem.id == menuItemObj.id);

            if (existingItem) {
                existingItem.quantity++;
                updateList();
            } else {
                addedItems.push({ id: menuItemObj.id, quantity: 1 })
                updateList();
            }

            orderDetails.style.display = 'flex'
        }
    }
})

document.addEventListener('click', e => {
    const itemToRemove = e.target.dataset.remove;

    if (itemToRemove){
        const menuItemObj = menuArray.find(menuItem => menuItem.id == itemToRemove);

        if (menuItemObj){
            const existingItemIndex = addedItems.findIndex(addedItem => addedItem.id == menuItemObj.id);

            if (existingItemIndex !== -1){
                const existingItem = addedItems[existingItemIndex];

                if (existingItem){
                    if (existingItem.quantity > 1){
                        existingItem.quantity--;
                        updateList();
                    } else if (existingItem.quantity === 1){
                        addedItems.splice(existingItemIndex, 1);
                        updateList();
                    }
                }
            }
        }
    }
})



function updateList(){
    checkoutList.innerHTML = '';
    const subTotal = document.getElementById('sub-total');
    subTotal.innerHTML = '';

    const totalPrice = addedItems.reduce((total, current) => {
        const menuItemObj = menuArray.find(menuItem => menuItem.id === current.id);
        const itemTotalPrice = menuItemObj.price * current.quantity;

        checkoutList.innerHTML += `
        <div class="selected-item">
            <h2>${menuItemObj.name}</h2>
            <button class="remove-btn" data-remove="${menuItemObj.id}">remove</button>
            <h3>$${itemTotalPrice}</h3>
        </div>
        `

        return total + itemTotalPrice

    }, 0)


    if (totalPrice > 1){
        subTotal.innerHTML = `$${totalPrice}`
    } else {
        orderDetails.style.display = 'none'
    }
}
