"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) {
        throw new Error('User ID not found in request. Make sure JwtAuthGuard is applied.');
    }
    return userId;
});
//# sourceMappingURL=current-user.decorator.js.map