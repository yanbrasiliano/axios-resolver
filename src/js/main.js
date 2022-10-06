import "regenerator-runtime/runtime";
import axios from "axios";

const statusEl = document.getElementById("status");
const dataEl = document.getElementById("data");
const headersEl = document.getElementById("headers");
const configEl = document.getElementById("config");

const BASE_URL = "https://jsonplaceholder.typicode.com";

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.common.Authorization =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
		
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const get = () => {
  return axios
    .get(`${BASE_URL}/posts`, {
      params: {
        _limit: 5,
      },
    })
    .then((response) => {
      return renderOutput(response);
    });
};

const post = () => {
  const data = {
    id: 1,
    title: "Axios Resolver Testing POST",
    body: "bar",
  };

  return axios.post(`${BASE_URL}/posts`, data).then((response) => {
    return renderOutput(response);
  });
};

const put = () => {
  const data = {
    id: 1,
    title: "Axios Resolver Testing PUT",
    body: "bar",
  };
  return axios.put(`${BASE_URL}/posts/1`, data).then((response) => {
    return renderOutput(response);
  });
};

const patch = () => {
  const data = {
    id: 1,
    title: "Axios Resolver Testing PATCH",
    body: "bar",
  };
  return axios.patch(`${BASE_URL}/posts/1`, data).then((response) => {
    return renderOutput(response);
  });
};

const del = () => {
  return axios.delete(`${BASE_URL}/posts/2`, data).then((response) => {
    return renderOutput(response);
  });
};

const multiple = () => {
  Promise.all([
    axios.get(`${BASE_URL}/posts`),
    axios.get(`${BASE_URL}/users`),
  ]).then((response) => {
    console.log(response);
  });
};

const transform = () => {
  return axios
    .get(`${BASE_URL}/posts`, {
      params: {
        _limit: 5,
      },
      transformResponse: [
        function (response) {
          return JSON.parse(response);
        },
      ],
    })
    .then((response) => {
      return renderOutput(response);
    });
};

const errorHandling = () => {
  return axios
    .get(`${BASE_URL}/postz`)
    .then((response) => {
      return renderOutput(response);
    })
    .catch((error) => {
      renderOutput(error.response);
    });
};

const cancel = () => {
  const controller = new AbortController();
  return axios
    .get(`${BASE_URL}/posts`, {
      params: {
        _limit: 5,
      },
      signal: controller.signal,
    })
    .then((response) => {
      return renderOutput(response);
    });
  controller.abort();
};

const clear = () => {
  statusEl.innerHTML = "";
  statusEl.className = "";
  dataEl.innerHTML = "";
  headersEl.innerHTML = "";
  configEl.innerHTML = "";
};

const renderOutput = (response) => {
  // Status
  const status = response.status;
  statusEl.removeAttribute("class");
  let statusElClass =
    "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium";
  if (status >= 500) {
    statusElClass += " bg-red-100 text-red-800";
  } else if (status >= 400) {
    statusElClass += " bg-yellow-100 text-yellow-800";
  } else if (status >= 200) {
    statusElClass += " bg-green-100 text-green-800";
  }

  statusEl.innerHTML = status;
  statusEl.className = statusElClass;

  // Data
  dataEl.innerHTML = JSON.stringify(response.data, null, 2);
  Prism.highlightElement(dataEl);

  // Headers
  headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
  Prism.highlightElement(headersEl);

  // Config
  configEl.innerHTML = JSON.stringify(response.config, null, 2);
  Prism.highlightElement(configEl);
};

document.getElementById("get").addEventListener("click", get);
document.getElementById("post").addEventListener("click", post);
document.getElementById("put").addEventListener("click", put);
document.getElementById("patch").addEventListener("click", patch);
document.getElementById("delete").addEventListener("click", del);
document.getElementById("multiple").addEventListener("click", multiple);
document.getElementById("transform").addEventListener("click", transform);
document.getElementById("cancel").addEventListener("click", cancel);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("clear").addEventListener("click", clear);
