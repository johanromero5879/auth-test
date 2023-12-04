import { UserIn } from "@auth/domain"
import { container } from "@container/index"
import { IRegisterUser } from "@auth/application"
import { createMockReqAndRes } from "@tests/__mocks__"
import { createRandomSignupUser } from "@tests/auth/__mocks__"
import { Controller } from "@shared/infrastructure/controller"
import { errorHandlerMiddleware } from "@shared/infrastructure/response-handler"

const registerUser = container.auth.resolve<IRegisterUser>("RegisterUser")
const loginController = container.auth.resolve<Controller>("LoginController")

let user: UserIn

beforeAll(async () => {
    user = createRandomSignupUser()
    await registerUser(user)
})

describe(`auth: login controller`, () => {

    const invalidCredentialsResponse = {
        success: false,
        error: {
            message: "You have entered an invalid email or password"
        }
    }

    test('should return access token when credentials are valid', async () => {
        const { req, res, next } = createMockReqAndRes()
        req.body = user
        await loginController(req, res, next)

        // Check if set a cookie
        expect(res.cookie).toHaveBeenCalled()

        // Get the data that was sent by res.json
        const data = (res.json as jest.Mock).mock.calls[0][0]

        expect(data).toHaveProperty("success")
        expect(data).toHaveProperty("data.access_token")
    })

    test('should return an error response when email does not exist', async () => {
        const { req, res, next } = createMockReqAndRes()

        req.body = {
            ...user,
            email: "john.titor@example.com"
        }

        await loginController(req, res, next)
        expect(next).toHaveBeenCalled()

        // Get the error that was sent by next
        const error = (next as jest.Mock).mock.calls[0][0]
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith(invalidCredentialsResponse)
    })

    test('should return an error response when email is valid but not password', async () => {
        const { req, res, next } = createMockReqAndRes()

        req.body = {
            ...user,
            password: "AFakeP4assword"
        }

        await loginController(req, res, next)
        expect(next).toHaveBeenCalled()

        // Get the error that was sent by next
        const error = (next as jest.Mock).mock.calls[0][0]
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith(invalidCredentialsResponse)
    })
})