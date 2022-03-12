<template>
    <div>
        <h1>tutorial using IndexedDB</h1>
        <v-btn @click="activateIndexedDB">Create the database</v-btn>
        <v-btn @click="addToDB">add a data</v-btn>
        <v-btn @click="getDBid">get datas</v-btn>
        <v-btn @click="removeDB">remove data</v-btn>
        <v-btn @click="cursorDB">All data in a glance</v-btn>
        <v-btn @click="updateDB">update data</v-btn>
        <div v-for="(item, i) in icons" :key="i">
            <v-icon :color="item.colour">mdi-{{item.name}}</v-icon>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                icons: undefined
            }
        },
        methods: {
            activateIndexedDB(){
                const IndexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                if (!IndexedDB) {
                    alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                }
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);

                requestIndexedDB.onerror = event => {
                    console.log(event);
                };
                requestIndexedDB.onupgradeneeded = event => {
                // Save the IDBDatabase interface
                    var db = event.target.result;

                    // Create an objectStore for this database
                    var objectStore = db.createObjectStore("icons", { autoIncrement : true });
                    objectStore.createIndex("icons_name", ["name"], { unique: false }); // créer les index de recherche
                    objectStore.createIndex("name_and_colour", ["name", "colour"], { unique: false }); // créer les index de recherche
                    console.log('database created');
                };            
            },
            addToDB() {
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);
                requestIndexedDB.onsuccess = event => {
                    var db = event.target.result;

                    var transaction = db.transaction("icons", "readwrite")
                    const store = transaction.objectStore('icons') // store = table in sql
                    // insert data  in the store
                    store.add({name: "account", colour: "red" })
                    store.add({name: "home", colour: "green" })
                    store.add({name: "basket", colour: "blue" })
                    console.log('icons added to the store');
                    transaction.oncomplete = () => {
                        db.close()
                    }
                };
            },
            getDBid() {
                // ouvre la db
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);
                requestIndexedDB.onerror = event => {
                    console.log(event);
                };

                // la requete
                requestIndexedDB.onsuccess = event => {
                    let db = event.target.result;

                    let transaction = db.transaction("icons", "readwrite")
                    let store = transaction.objectStore('icons') // store = table in sql
                    let indexName = store.index("icons_name"); // pour une recherche sur un index particulier

                    let idQuery = store.get(1)
                    idQuery.onsuccess = () => {
                        console.log("idQuery", idQuery.result);
                    }
                    let allDatas = store.getAll() // renvoie tous les modeles qui sont vert
                    allDatas.onsuccess = () => {
                        this.icons = allDatas.result
                    }

                   // close db at the end of transaction
                    transaction.oncomplete = () => {
                        db.close()
                    }
                    transaction.onerror = event => { // si il y a une erreur dans la requete
                        console.log(event);
                    };
                };
            },
            updateDB(){
                // ouvre la db
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);
                requestIndexedDB.onerror = event => {
                    console.log(event);
                };

                // la requete
                requestIndexedDB.onsuccess = event => {
                    let db = event.target.result;

                    let transaction = db.transaction("icons", "readwrite")
                    let store = transaction.objectStore('icons') // store = table in sql

                    let idQuery = store.get(1)
                    idQuery.onsuccess = () => {
                        let data = idQuery.result
                        data.size = "small"
                        console.log(data);
                        let updateRequest = store.update(data);
                        updateRequest.onsuccess = () => {
                            console.log(updateRequest.result)
                        }
                    }

                   // close db at the end of transaction
                    transaction.oncomplete = () => {
                        db.close()
                    }
                    transaction.onerror = event => { // si il y a une erreur dans la requete
                        console.log(event);
                    };
                };
            },
            cursorDB(){
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);
                requestIndexedDB.onerror = event => {
                    console.log(event);
                };

                // la requete
                requestIndexedDB.onsuccess = event => {
                    let db = event.target.result;

                    let transaction = db.transaction("icons", "readwrite")
                    let store = transaction.objectStore('icons') // store = table in sql
                    let idQuery = store.openCursor() // recherche sur l'id
                    idQuery.onsuccess = event => {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log("Name for key " + cursor.key + " is " + cursor.value.name);
                            cursor.continue();
                        }
                        else {
                            console.log("No more entries!");
                        }
                    }

                   // close db at the end of transaction
                    transaction.oncomplete = () => {
                        db.close()
                    }
                };
            },
            removeDB() {
                const requestIndexedDB = window.indexedDB.open("Map_Database", 1);
                requestIndexedDB.onerror = event => {
                    console.log(event);
                };

                // la requete
                requestIndexedDB.onsuccess = event => {
                    let db = event.target.result;

                    let transaction = db.transaction("icons", "readwrite")
                    let store = transaction.objectStore('icons') // store = table in sql

                    let idQuery = store.delete(3) // recherche sur l'id
                    idQuery.onsuccess = event => {
                        console.log("data deleted successfully", event);
                    }

                   // close db at the end of transaction
                    transaction.oncomplete = () => {
                        db.close()
                    }
                    transaction.onerror = event => { // si il y a une erreur dans la requete
                        console.log(event);
                    };
                };
            }
        },
        mounted () {
        },
    }
</script>

<style lang="scss" scoped>

</style>