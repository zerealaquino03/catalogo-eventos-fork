import type { Request, Response } from 'express';
import z from 'zod';

const criarEventoSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    cat: z.string().min(1, 'Categoria é obrigatória'),
    data: z.date({ error: 'Data inválida' }),
    hora: z.string().min(1, 'Hora é obrigatória'),
    local: z.string().min(1, 'Local é obrigatório'),
    preco: z.number().nonnegative('Preço deve ser um número não negativo'),
    img: z.url('Imagem deve ser uma URL válida'),
    desc: z.string().min(1, 'Descrição é obrigatória'),
});

const listaEventos: any[] = [];
export class CriarEventoController {
    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const eventoData = criarEventoSchema.parse({
                titulo: req.body.titulo,
                cat: req.body.cat,
                data: new Date(req.body.data),
                hora: req.body.hora,
                local: req.body.local,
                preco: req.body.preco === 'Gratuito' ? 0 : parseFloat(req.body.preco),
                img: req.body.img,
                desc: req.body.desc,
            });
            listaEventos.push(eventoData);
            return res.status(201).json({ message: 'Evento criado com sucesso' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error!.issues.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}