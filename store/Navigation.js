import { observable } from 'mobx';

class NavigationStore {
    @observable navigation = null;
    constructor(root) {
        this.root = root;
    }
    setNavigation(navigation) {
        this.navigation = navigation;
    }
}

export default NavigationStore;
