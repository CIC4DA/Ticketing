import axios from "axios";
import { useState } from "react";

const useRequest = async ({url, method, body}) => {
    const [backendErrors, setBackendErrors] = useState([]);

    const doRequest = async() => {
        await axios[method](url, body)
        .then((response) => {
            return response.data;
        })
        .catch(({ response }) => {
            setBackendErrors(response.data.errors)
        })
    }

    return {doRequest, backendErrors};
}

export default useRequest;