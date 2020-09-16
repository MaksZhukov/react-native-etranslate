import axios from "axios";

let debug = "http://localhost:3000";
let remote = "https://e-translate.herokuapp.com/api";

export default axios.create({
    baseURL: remote,
});
