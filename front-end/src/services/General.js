import axios from 'axios';
import { URLBASE } from "@/services/config.js";
const URLLOCAL = '/general'

export const getAllMaterials = () =>
    axios.request({
        method: "GET",
        baseURL: URLBASE + URLLOCAL,
        url: `get-all-materials`,
    });

    