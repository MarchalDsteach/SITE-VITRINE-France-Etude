"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe('HealthController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api', { exclude: ['health'] });
        await app.init();
    });
    it('/health (GET) renvoie status ok', () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect(200)
            .expect((res) => {
            expect(res.body.status).toBe('ok');
        });
    });
    afterEach(async () => {
        await app.close();
    });
});
//# sourceMappingURL=health.e2e-spec.js.map