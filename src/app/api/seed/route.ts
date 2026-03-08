/**
 * API: /api/seed
 * Acción: Inicialización de la base de datos (Semilla).
 * IMPORTANTE: Solo se debe usar al inicio o para restaurar datos de prueba.
 * Cuidado: El método actual borra las colecciones previas antes de insertar.
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company, Project, Planner, BrandIdentity, Strategy } from '@/lib/models';

export async function POST() {
    try {
        await connectDB();

        // 1. LIMPIEZA: Eliminamos todos los registros previos para evitar duplicidad en el modo prueba
        await Promise.all([
            Company.deleteMany({}),
            Project.deleteMany({}),
            Planner.deleteMany({}),
            BrandIdentity.deleteMany({}),
            Strategy.deleteMany({})
        ]);

        // 2. INSERTAR EMPRESAS (PUEDES CAMBIAR ESTOS NOMBRES AQUÍ)
        const companies = await Company.create([
            { empresaId: 'fortis', nombre: 'FORTIS BIENES RAÍCES' },
            { empresaId: 'crescendo', nombre: 'CRESCENDO MARCA PERSONAL' }
        ]);

        // 3. INSERTAR PROYECTOS DE PRUEBA (PUEDES CAMBIAR LOS NOMBRES Y RESPONSABLES)
        await Project.create([
            { id: 'p1', nombre: 'Edificio Los Pinos', estado: 'Activo', responsable: 'Johan', ticket: '$120,000', empresaId: 'fortis' },
            { id: 'p2', nombre: 'Loteo El Sol', estado: 'En curso', responsable: 'Marta', ticket: '$85,000', empresaId: 'fortis' },
            { id: 'p3', nombre: 'Lanzamiento Marca', estado: 'Planificación', responsable: 'Johan', ticket: 'N/A', empresaId: 'crescendo' }
        ]);

        // 4. INSERTAR PLANNER (CALENDARIO)
        await Planner.create([
            { id: 't1', contenido: 'Reel: Cómo invertir en Villavicencio', publicacion: 'Lunes 10:00 AM', formato: 'Reel', estado: 'Programado' },
            { id: 't2', contenido: 'Post: Tips para primera compra', publicacion: 'Miércoles 5:00 PM', formato: 'Post', estado: 'Programado' }
        ]);

        // 5. INSERTAR IDENTIDADES ESTRATÉGICAS
        await BrandIdentity.create([
            {
                empresaId: 'fortis',
                base: {
                    queEs: 'Agencia inmobiliaria premium focusing en ROI.',
                    nicho: 'Inversionistas de bienes raíces.',
                    propuesta: 'Vender más rápido con tecnología avanzada.',
                    tono: 'Profesional y Disruptivo'
                },
                personas: [
                    { nombre: 'Inversionista Novato', edad: '25-35', problema: 'Miedo a perder capital', deseo: 'Libertad financiera', objecion: 'Falta de confianza' }
                ]
            }
        ]);

        // 6. INSERTAR ESTRATEGIA DE META ADS
        await Strategy.create({
            empresaId: 'fortis',
            nombre: 'Campaña Captación de Leads Q1',
            objetivo: 'Generación de Leads',
            presupuesto: '$500',
            conjuntos: [
                {
                    nombre: 'Público: Inversionistas Colombia',
                    anuncios: [
                        { nombre: 'Video: Testimonios', formato: 'Reels', metodologia: 'AIDA', contenido: 'Empieza con la duda...', cpl: '$1.2' }
                    ]
                }
            ]
        });

        return NextResponse.json({ message: 'Base de datos inicializada correctamente ✅' });
    } catch (error) {
        console.error("Error en SEED:", error);
        return NextResponse.json({ error: 'Error al inicializar datos' }, { status: 500 });
    }
}
