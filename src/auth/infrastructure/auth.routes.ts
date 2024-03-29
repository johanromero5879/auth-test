import { Router } from "express"

import { container } from "@container/index";
import { Controller } from "@shared/infrastructure/controller";

// Router
export const authRouter = Router()

authRouter.post("/signup", container.auth.resolve<Controller>("SignupController"))
authRouter.post("/login", container.auth.resolve<Controller>("LoginController"))
authRouter.delete("/logout", container.auth.resolve<Controller>("LogoutController"))
authRouter.get("/refresh-token", container.auth.resolve<Controller>("RefreshTokenController"))
authRouter.get("/google", container.auth.resolve<Controller>("RedirectGoogleOAuthController"))
authRouter.get("/google/callback", container.auth.resolve<Controller>("GoogleOAuthController"))
authRouter.get("/microsoft", container.auth.resolve<Controller>("RedirectMicrosoftOAuthController"))
authRouter.get("/microsoft/callback", container.auth.resolve<Controller>("MSOAuthController"))
