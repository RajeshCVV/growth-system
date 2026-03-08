import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, Planner, BrandIdentity, Strategy } from '@/models';

export async function POST() {
    try {
        console.log("Iniciando SEED...");
        await connectDB();

        console.log("Limpiando colecciones...");
        await Promise.all([
            Company.deleteMany({}),
            Project.deleteMany({}),
            Planner.deleteMany({}),
            BrandIdentity.deleteMany({}),
            Strategy.deleteMany({})
        ]);

        console.log("Insertando Empresas...");
        await Company.create([
            { empresaId: 'fortress', nombre: 'Fortress', logo: 'F', color: '#4f46e5' },
            { empresaId: 'crescendo', nombre: 'Crescendo', logo: 'C', color: '#10b981' }
        ]);

        console.log("Insertando Proyectos...");
        await Project.create([
            { id: 'p1', nombre: 'Edificio Los Pinos', estado: 'Activo', responsable: 'Johan', ticket: '$120,000', empresaId: 'fortress', fechaCierre: '2024-12-31' },
            { id: 'p2', nombre: 'Loteo El Sol', estado: 'En curso', responsable: 'Marta', ticket: '$85,000', empresaId: 'fortress', fechaCierre: '2024-11-20' },
            { id: 'p3', nombre: 'Lanzamiento Marca', estado: 'Planificación', responsable: 'Johan', ticket: 'N/A', empresaId: 'crescendo', fechaCierre: '2024-10-15' }
        ]);

        console.log("Insertando Planner...");
        await Planner.create([
            { id: 't1', contenido: 'Reel: Cómo invertir', publicacion: 'Lunes', formato: 'Reel', estado: 'Programado', proyecto: 'Inversión' }
        ]);

        console.log("Insertando Identidad...");
        await BrandIdentity.create([
            {
                empresaId: 'fortress',
                base: { queEs: 'Agencia inmobiliaria premium focusing en ROI.', nicho: 'Inversionistas de bienes raíces.', propuesta: 'Vender más rápido con tecnología avanzada.', tono: 'Profesional y Disruptivo' },
                personas: [
                    { nombre: 'Inversionista Novato', edad: '25-35', problema: 'Miedo a perder capital', deseo: 'Libertad financiera', objecion: 'Falta de confianza' }
                ]
            }
        ]);

        console.log("Insertando Estrategia...");
        await Strategy.create({
            empresaId: 'fortress',
            nombre: 'Campaña Leads',
            objetivo: 'Leads',
            conjuntos: []
        });

        console.log("SEED completado con éxito");
        return NextResponse.json({ message: 'Sistema inicializado correctamente ✅' });
    } catch (error: any) {
        console.error("ERROR CRÍTICO EN SEED:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
