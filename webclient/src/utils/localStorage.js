// save
function saveArrayToLocalStorage(arrayKey, arrayData) {
    localStorage.setItem(arrayKey, JSON.stringify(arrayData));
  }
  
  // read
  export function getArrayFromLocalStorage(arrayKey) {
    const data = localStorage.getItem(arrayKey);
    return data ? JSON.parse(data) : [];
  }
  
  // add
  export function addToLocalStorageArray(arrayKey, newItem) {
    const array = getArrayFromLocalStorage(arrayKey);
    if (!array.includes(newItem)) {
      array.push(newItem);
      saveArrayToLocalStorage(arrayKey, array);
    }
  }
  
  // delete
  export function removeFromLocalStorageArray(arrayKey, itemToRemove) {
    const array = getArrayFromLocalStorage(arrayKey);
    const updatedArray = array.filter(item => item !== itemToRemove);
    saveArrayToLocalStorage(arrayKey, updatedArray);
  }
  
  