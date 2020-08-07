const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold our state

let items = [];
const handleSubmit = e => {
    e.preventDefault(); // prevent the page from reloading
    const name = e.currentTarget.item.value;
    if (!name) return;
    const item = {
        name,
        id: Date.now(),
        complete: false,
    };
     // push it into our state
    items.push(item);
    console.info(`There are now ${items.length} item in your state`);
    e.target.reset();
    // we crete our own event called "itemsUpdated"
    list.dispatchEvent(new CustomEvent('itemsUpdated'));    
};

const displayItems = () => {
    console.log(items);
    const html = items
    .map(
        item => 
    `<li class="shopping-item">
        <input 
            value="${item.id}"
            ${item.complete ? 'checked' : ''}
            type="checkbox">
        <span class="itemName">${item.name}</span>
        <button 
            area-label="Remove ${item.name}"
            value=" ${item.id}">&times;
        </button>
    </li>`
    )
    .join('');
    list.innerHTML = html;
};

const mirrorToLocalStorage = () => {
    console.info('mirroring items to local storage');
    localStorage.setItem('items', JSON.stringify(items));
};

const restoreFromLocalStorage = () => {
    console.info('Restoring from LS');
    const lsItems = JSON.parse(localStorage.getItem('items'));
    // check if there is something inside local storage
    if (lsItems) {
        // push has no limit for arguments
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
};

const deleteItems = (id) => {
    console.log('deleting items', id);
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const marksAsComplete = id => {
    console.log(id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}


shoppingForm.addEventListener('submit', handleSubmit);
// we listen for our own event, and launch the function displayItems, when clicking the button
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
        deleteItems(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
        marksAsComplete(id);
    }
});

restoreFromLocalStorage();
