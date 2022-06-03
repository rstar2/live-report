export default function http(url: string, data?: Record<string, unknown>, authToken?: string) {
  const opts = {
    headers: {},
  };

  if (authToken) {
    Object.assign(opts.headers, {
      Authorization: "Bearer " + authToken,
    });
  }

  // if sending data as JSON body must be JSON encoded string
  // AND !!! 'Content-Type' header must be valid JSON one
  if (data) {
    Object.assign(opts, {
      method: "POST",
      body: JSON.stringify(data),
    });
    // !!! this is obligatory for JSON encoded data so that the Express 'body-parser' to parse it properly
    Object.assign(opts.headers, {
      "Content-Type": "application/json",
    });
  }

  return fetch(url, opts)
    .then((res) => {
      switch (res.status) {
        case 401: // Unauthorized
        case 403: // Forbidden
          return Promise.reject(ERROR_UNAUTHORIZED);
      }

      if (!res.ok) {
        return res.json().then((err) => Promise.reject(err));
      }
      return res;
    })
    .then((res) => res.json());
}

export const ERROR_UNAUTHORIZED = "Unauthorized";
