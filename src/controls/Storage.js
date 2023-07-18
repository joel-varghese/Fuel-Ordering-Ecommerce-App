export class Storage {
	
    // Update storage method here.
    static storage = sessionStorage;
  
    static setItem(key, value) {
      this.storage.setItem(key, value);
    }
  
    static getItem(key) {
      return this.storage.getItem(key);
    }
  
    static removeItem(key) {
      this.storage.removeItem(key);
    }
  
    static clear() {
      this.storage.clear();
    }
  }
  export const jsonStringify = (str) => {
        return JSON.parse(JSON.stringify(str));
  }