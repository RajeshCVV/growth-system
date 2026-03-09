import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, EditorialContent, Calendar, Campaign, AdSet, Ad } from '@/models';

export async function POST() {
    try {
        console.log("Iniciando SEED V3...");
        await connectDB();

        console.log("Limpiando colecciones V3...");
        await Promise.all([
            Company.deleteMany({}),
            Project.deleteMany({}),
            EditorialContent.deleteMany({}),
            Calendar.deleteMany({}),
            Campaign.deleteMany({}),
            AdSet.deleteMany({}),
            Ad.deleteMany({})
        ]);

        console.log("Insertando Empresas Base...");
        await Company.create([
            { empresaId: 'fortress', nombre: 'Fortress Real Estate', logo: 'F', color: '#8b5cf6' },
            { empresaId: 'crescendo', nombre: 'Crescendo Agency', logo: 'C', color: '#10b981' }
        ]);

        console.log("Insertando Proyectos de Prueba...");
        await Project.create([
            { empresaId: 'fortress', nombre: 'Boulevard El Parque', tipo_proyecto: 'Marca de proyecto', estado_comercial: 'Lanzamiento' },
            { empresaId: 'fortress', nombre: 'Villas del Sol', tipo_proyecto: 'Proyecto simple', estado_comercial: 'Venta Blanca' },
        ]);

        console.log("Insertando Calendario Mixto MOCK...");
        await EditorialContent.create([
            { empresa_id: 'fortress', proyecto_id: 'Boulevard El Parque', tipo_contenido: 'Expectativa', tema: 'Avance de Obra Febrero', prioridad: 'Alta' }
        ]);

        console.log("Insertando Motor de Pauta MOCK...");
        await Campaign.create([
            { empresa_id: 'fortress', nombre: 'Campaña Leads - Boulevard', objetivo: 'Leads', presupuesto: 5000000, estado: 'Borrador' }
        ]);

        console.log("SEED V3 completado con éxito");
        return NextResponse.json({ message: 'Estructura V3 inicializada correctamente ✅' });
    } catch (error: any) {
        console.error("ERROR CRÍTICO EN SEED V3:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

