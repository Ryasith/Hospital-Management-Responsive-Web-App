let cacheData="appV1";
const DB_NAME = 'childDataDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'childDataStore';

this.addEventListener("install", (event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/chunk.js',
                '/static/js/bundle.js',
                '/index.html',
                '/login',
                '/children',
                '/static/media/logo.b49106f3710f8631a972.png',
                '/favicon.ico',
                '/manifest.json',
                '/dashboard'
            ])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        if (event.request.url === "http://localhost:3000/static/js/main.chunk.js") {
            event.waitUntil(
                this.registration.showNotification("Internet", {
                    body: "internet not working",
                })
            )
        }
        event.respondWith(
            caches.match(event.request).then((resp) => {
                if (resp) {
                    return resp
                }
                let requestUrl = event.request.clone();
                fetch(requestUrl)
            })
        )
    }
})

const checkOnlineStatusAndPostData = async () => {
    if (navigator.onLine) {
        await postChildDataFromIndexedDB();
    }
};

setInterval(checkOnlineStatusAndPostData, 60000);

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const saveToIndexedDB = (data) => {
    return openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(DB_STORE_NAME);
            store.add(data);

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
};

const postChildDataFromIndexedDB = async () => {
    const db = await openDatabase();
    const transaction = db.transaction([DB_STORE_NAME], 'readonly');
    const store = transaction.objectStore(DB_STORE_NAME);
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = async () => {
        const allData = getAllRequest.result;
        for (const data of allData) {
            console.log(data);
            try {
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    if (key !== 'file' && key !== 'id') {
                        formData.append(key, data[key]);
                    }
                });
                if (data.file) {
                    formData.append('childImage', data.file);
                }

                const response = await fetch('http://localhost:5001/general/add_child_Info', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const deleteTransaction = db.transaction([DB_STORE_NAME], 'readwrite');
                    const deleteStore = deleteTransaction.objectStore(DB_STORE_NAME);
                    deleteStore.delete(data.id);
                }
            } catch (error) {
                console.error('Failed to send data:', error);
            }
        }
    };
};
