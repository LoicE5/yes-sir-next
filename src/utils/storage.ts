const sessionStorage = {
    save(key:string, value:string) {
        window.sessionStorage.setItem(key, value);
    },
    load(key:string) {
        return window.sessionStorage.getItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    },
    isEmpty() {
        if (window.sessionStorage.length > 0) {
            return false;
        } else {
            return true;
        }
    },
    loadAll() {
        var archive = {} as any, // Notice change here
        keys = Object.keys(window.sessionStorage),
        i = keys.length;

        while ( i-- ) {
            archive[ keys[i] ] = window.sessionStorage.getItem( keys[i] );
        }

        return archive;
    }
}

const localStorage = {
    save(key:string, value:string) {
        window.localStorage.setItem(key, value);
    },
    load(key:string) {
        return window.localStorage.getItem(key);
    },
    clear() {
        window.localStorage.clear();
    },
    isEmpty() {
        if (window.localStorage.length > 0) {
            return false;
        } else {
            return true;
        }
    },
    loadAll() {
        var archive = {} as any, // Notice change here
        keys = Object.keys(window.localStorage),
        i = keys.length;

        while ( i-- ) {
            archive[ keys[i] ] = window.localStorage.getItem( keys[i] );
        }

        return archive;
    }
}

export {sessionStorage, localStorage}