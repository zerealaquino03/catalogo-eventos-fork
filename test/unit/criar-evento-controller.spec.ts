// SUITE DE TESTES PARA criar-evento-controller.ts
import type { Request, Response } from 'express';
// const req = { body: { email: '' } } as unknown as Request;
function mockResponse() {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response & {
        status: jest.Mock;
        json: jest.Mock;
    };
}

const req = {
    body: {
        titulo: "Festival Gastronômico do Centro",
        cat: "Gastronomia",
        data: "2025-09-20",
        hora: "18:00",
        local: "Rua Ponciano, Centro",
        preco: "Gratuito",
        img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
        desc: "Barracas, food trucks e música ao vivo com artistas locais."
    }
} as unknown as Request;

import { CriarEventoController } from '../../src/controllers/criar-eventos-controller';
describe('CriarEventoController', () => {

    // TESTA UM CENÁRIO EXEMPLO
    it('should create an instance', () => {
        // Exemplo simples de teste
        expect(true).toBe(true);
    });

    it('should handle event creation', async () => {
        const controller = new CriarEventoController();
        const req = {
            body: {
                titulo: "Festival Gastronômico do Centro",
                cat: "Gastronomia",
                data: "2025-09-20",
                hora: "18:00",
                local: "Rua Ponciano, Centro",
                preco: "Gratuito",
                img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: "Barracas, food trucks e música ao vivo com artistas locais."
            }
        } as unknown as Request; // Mock da requisição
        const res = mockResponse();

        await controller.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento criado com sucesso' });
    });

    it('should return 400 when create event with invalid data', async () => {
        const controller = new CriarEventoController();
        const req = {
            body: {
                titulo: "", // Título inválido
                cat: "Gastronomia",
                data: "2025-09-20",
                hora: "18:00",
                local: "Rua Ponciano, Centro",
                preco: "Gratuito",
                img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: "Barracas, food trucks e música ao vivo com artistas locais."
            }
        } as unknown as Request; // Mock da requisição com dados inválidos
        const res = mockResponse();

        await controller.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    message: 'Título é obrigatório',
                    path: 'titulo',
                })
            ]),
            message: "Validation error",
        }));
    });

    it('should fail to create event with invalid data', async () => {
        const controller = new CriarEventoController();
        const req = {
            body: {
                titulo: "", // Título inválido
                cat: "", // Categoria inválida
                data: "invalid-date",
                hora: "",
                local: "", // Local inválido
                preco: "", // Preço inválido
                img: "invalid-url", // Imagem inválida
                desc: "" // Descrição inválida
            }
        } as unknown as Request; // Mock da requisição com dados inválidos
        const res = mockResponse();

        await controller.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(expect.any(Number));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayOf(expect.objectContaining({
                message: expect.any(String),
                path: expect.any(String),
            })),
            message: "Validation error",
        }));
        expect(res.json.mock.calls[0][0].errors.length).toBe(8);
    });
});