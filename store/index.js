import NavigationStore from './Navigation';
import User from './user';
import UserDictionary from './userDictionary';

class RootStore {
    constructor() {
        this.user = new User(this);
        this.userDictionary = new UserDictionary(this);
        this.navigation = new NavigationStore(this);
    }
}

export default new RootStore();
