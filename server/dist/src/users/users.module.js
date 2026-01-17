"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth.controller");
const user_contoller_1 = require("./controllers/user.contoller");
const auth_service_1 = require("./services/auth.service");
const users_service_1 = require("./services/users.service");
const jwt_service_1 = require("./services/jwt.service");
const user_repository_1 = require("./repositorys/user.repository");
const jwt_auth_guard_guard_1 = require("../../libs/common/guard/jwt-auth.guard.guard");
const telegram_bot_module_1 = require("../telegram-bot/telegram-bot.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => telegram_bot_module_1.TelegramBotModule)],
        controllers: [auth_controller_1.AuthController, user_contoller_1.UserController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, jwt_service_1.JwtService, user_repository_1.UserRepository, jwt_auth_guard_guard_1.JwtAuthGuard],
        exports: [auth_service_1.AuthService, users_service_1.UsersService, jwt_service_1.JwtService, user_repository_1.UserRepository, jwt_auth_guard_guard_1.JwtAuthGuard],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map