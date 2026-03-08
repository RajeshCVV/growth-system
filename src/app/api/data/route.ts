import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Company, BrandIdentity, Project, Strategy, Planner, Metrics } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        const empresas = await Company.find().lean();
        const identidad = await BrandIdentity.find().lean();
        const proyectos = await Project.find().lean();
        const estrategia = await Strategy.find().lean();
        const planner = await Planner.find().lean();
        const metricasDocs = await Metrics.find().lean();

        // Transformar los datos para que encajen en el formato esperado por el Frontend
        const metricasGenerales = metricasDocs[0] || {
            leads: 0, cplPromedio: '$0', roi: '0%', inversion: '$0'
        };

        const identidadMap: Record<string, any> = {};
        identidad.forEach((idDoc: any) => {
            identidadMap[idDoc.empresaId.toString()] = {
                base: idDoc.base,
                personas: idDoc.personas
            };
        });

        // Mapeamos los IDs a strings para pasarlos al frontend
        const parseResult = (docs: any[]) => docs.map(doc => ({ ...doc, id: doc._id.toString() }));

        const mockDataFormat = {
            empresas: parseResult(empresas),
            identidad: identidadMap,
            proyectos: parseResult(proyectos).map(p => ({ ...p, empresaId: p.empresaId.toString() })),
            estrategia: parseResult(estrategia),
            planner: parseResult(planner),
            metricasGenerales
        };

        return NextResponse.json(mockDataFormat);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
