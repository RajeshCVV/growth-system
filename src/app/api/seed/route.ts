import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Company, BrandIdentity, Project, Strategy, Planner, Metrics } from '@/models';

// Datos iniciales de prueba (Mock Data convertido a Seed)
const seedData = {
    empresas: [
        { nombre: 'Fortis', logo: 'F', color: 'bg-blue-600' },
        { nombre: 'Crescendo', logo: 'C', color: 'bg-indigo-600' }
    ],
    metricasGenerales: {
        leads: 1450,
        cplPromedio: '$2.15',
        roi: '350%',
        inversion: '$3,100'
    }
};

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await connectToDatabase();

        // Limpiar BD
        await Company.deleteMany({});
        await BrandIdentity.deleteMany({});
        await Project.deleteMany({});
        await Strategy.deleteMany({});
        await Planner.deleteMany({});
        await Metrics.deleteMany({});

        // Crear Empresas
        const [fortis, crescendo] = await Company.insertMany(seedData.empresas);

        // Identidad
        await BrandIdentity.create([
            {
                empresaId: fortis._id,
                base: {
                    queEs: 'Agencia de consultoría y aceleración de negocios.',
                    nicho: 'Emprendedores y dueños de negocios B2B.',
                    propuesta: 'Sistematizamos tu crecimiento para que no dependas de la suerte.',
                    tono: 'Directo, profesional, autoritario pero accesible.'
                },
                personas: [
                    { nombre: 'El Dueño Estancado', edad: '35-45', problema: 'Vende pero no tiene ganancias reales. Trabaja 14 horas al día.', deseo: 'Libertad financiera y operativa.', objecion: 'No tengo tiempo para implementar sistemas.' }
                ]
            },
            {
                empresaId: crescendo._id,
                base: {
                    queEs: 'Academia de desarrollo personal y habilidades de alto valor.',
                    nicho: 'Jóvenes profesionales y emprendedores primerizos.',
                    propuesta: 'Desarrolla la mentalidad y habilidades para escalar tus ingresos.',
                    tono: 'Inspirador, enérgico, disruptivo.'
                },
                personas: [
                    { nombre: 'El Joven Ambicioso', edad: '20-28', problema: 'No sabe por dónde empezar, exceso de información.', deseo: 'Crear su primera fuente de ingresos estable.', objecion: 'Falta de capital inicial.' }
                ]
            }
        ]);

        // Proyectos
        const proyectos = await Project.insertMany([
            { empresaId: fortis._id, nombre: 'Lanzamiento Programa X', estado: 'En curso', ticket: '$997', fechaCierre: '2024-11-30', responsable: 'Johan' },
            { empresaId: fortis._id, nombre: 'Consultoría B2B High Ticket', estado: 'Activo', ticket: '$5,000', fechaCierre: 'Continuo', responsable: 'Ana' },
            { empresaId: crescendo._id, nombre: 'Reto 7 Días Crescendo', estado: 'Planificación', ticket: '$47', fechaCierre: '2024-12-15', responsable: 'Carlos' }
        ]);

        // Estrategia
        await Strategy.create({
            proyectoId: proyectos[0]._id,
            nombre: 'Lanzamiento X - Atracción',
            objetivo: 'Conversión',
            conjuntos: [
                {
                    nombre: 'Público Abierto (Emprendedores)',
                    anuncios: [
                        { nombre: 'AD1 - El problema de las 14 horas', formato: 'Reel', metodologia: 'PAS', contenido: 'Educativo', cpl: '$2.50' },
                        { nombre: 'AD2 - Mi historia (Prueba Social)', formato: 'Carrusel', metodologia: 'Storytelling', contenido: 'Autoridad', cpl: '$1.80' }
                    ]
                }
            ]
        });

        // Planner
        await Planner.create([
            { proyecto: 'Lanzamiento X', contenido: 'AD1 - El problema...', formato: 'Reel', grabacion: '2024-10-25', publicacion: '2024-11-01', responsable: 'Equipo Video', estado: 'Por grabar' },
            { proyecto: 'Lanzamiento X', contenido: 'AD2 - Mi historia', formato: 'Carrusel', grabacion: 'N/A', publicacion: '2024-11-03', responsable: 'Diseño', estado: 'En edición' }
        ]);

        // Metric
        await Metrics.create(seedData.metricasGenerales);

        return NextResponse.json({ message: 'Base de datos inicializada exitosamente' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
