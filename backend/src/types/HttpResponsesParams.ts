import { Response } from "express"

type HttpResponsesParams<T> = {
    res: Response
    data: T
    message: string | null
    code: number
}

export default HttpResponsesParams
