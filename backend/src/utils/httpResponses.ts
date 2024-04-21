import HttpResponseParams from "../types/HttpResponsesParams"

export function success<T>(params: HttpResponseParams<T>) {
    const { res, data, message, code } = params

    res.status(code).json({
        status: "Request was successful.",
        message: message,
        data: data,
    })
}

export function error<T>(params: HttpResponseParams<T>) {
    const { res, data, message, code } = params

    res.status(code).json({
        status: "Error has occurred.",
        message: message,
        data: data,
    })
}
