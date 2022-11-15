const fileURLStore = window.sessionStorage;
export default {
    getItem(key) {
        try {
            return JSON.parse(fileURLStore.getItem(key));
        } catch (err) {
            return null;
        }
    },
    setItem(key, val) {
        fileURLStore.setItem(key, JSON.stringify(val));
    },
    clear() {
        fileURLStore.clear();
    },
    keys(index) {
        return fileURLStore.key(index);
    },
    removeItem(key) {
        fileURLStore.removeItem(key);
    }
}

