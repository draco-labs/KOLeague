const dbName = "UserDB";
const storeName = "recentUsers";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "screenName" }); // Khóa chính là screenName
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const handleScreenNameClick = async (screenName, avatarUrl, twitterUrl) => {
    const db = await openDB();
  
    // Thêm hoặc cập nhật user
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
  
    store.delete(screenName); // Xóa nếu user đã tồn tại
    store.put({ screenName, avatarUrl, twitterUrl, addedAt: Date.now() }); // Thêm mới
  
    const users = [];
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        users.push(cursor.value);
        cursor.continue();
      }
    };
  
    transaction.oncomplete = async () => {
      if (users.length > 5) {
        // Lấy user cũ nhất
        const oldestUser = users[0];
        console.log(oldestUser)
       
        const deleteTransaction = db.transaction(storeName, "readwrite");
        const deleteStore = deleteTransaction.objectStore(storeName);
  
        deleteStore.delete(oldestUser.screenName);
  
        deleteTransaction.oncomplete = () => {
          console.log(`Deleted oldest user: ${oldestUser.screenName}`);
          db.close(); 
        };
  
        deleteTransaction.onerror = (error) => {
          console.error("Error deleting oldest user:", error.target.error);
          db.close(); 
        };
      } else {
        
        db.close();
      }
    };
  
    transaction.onerror = (error) => {
      console.error("Error adding/updating user:", error.target.error);
      db.close();
    };
  };
  

export const handleFocus = async () => {
    const db = await openDB();
  
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
  
    const users = await new Promise((resolve, reject) => {
      const result = [];
      const request = store.openCursor();
  
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push(cursor.value); 
          cursor.continue();
        } else {
          resolve(result); 
        }
      };
  
      request.onerror = (event) => {
        reject(event.target.error); 
      };
    });
  
    db.close();
    return users; 
  };
  

const deleteUser = async (screenName) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).delete(screenName);
  transaction.oncomplete = () => console.log(`${screenName} deleted.`);
  db.close();
};
