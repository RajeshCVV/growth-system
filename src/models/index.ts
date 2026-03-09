import mongoose, { Schema, Document } from 'mongoose';

// --- Interfaces (Contratos de Datos) ---

// 1. Empresa
export interface ICompany extends Document {
    empresaId: string; // Ej: 'fortress', 'crescendo'
    nombre: string;
    tipo: string;
    estado: string;
    logo?: string;
    color?: string;
}

// 2. Proyecto (incluye Marcas de Proyecto)
export interface IProject extends Document {
    empresaId: string; // Relación con Company
    nombre: string;
    tipo_proyecto: 'Marca de proyecto' | 'Proyecto simple' | 'Masterplan';
    descripcion?: string;
    estado_comercial: string;
    // Específico para 'Marca de proyecto'
    branding?: {
        logo?: string;
        colores?: string[];
        redes_sociales?: {
            instagram?: string;
            facebook?: string;
            tiktok?: string;
            web?: string;
        };
        linea_comunicacion?: string;
    };
}

// 3. Campaña
export interface ICampaign extends Document {
    proyecto_id?: string; // Relación con Project. Opcional si es campaña de marca
    empresa_id: string; // Obligatorio para saber quién paga
    nombre: string;
    objetivo: string;
    presupuesto: number;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
}

// 4. Conjunto de Anuncios
export interface IAdSet extends Document {
    campana_id: string; // Relación con Campaign
    nombre: string;
    tipo_segmento: 'Abierto' | 'Advantage+' | 'Profesiones' | string;
    audiencia: string;
    presupuesto: number;
    estado: string;
}

// 5. Anuncio (Base)
export interface IAd extends Document {
    conjunto_id: string; // Relación con AdSet
    nombre: string;
    formato: string;
    objetivo: string;
    estado: string;
}

// 6. Creativo (El contenido del anuncio)
export interface ICreative extends Document {
    anuncio_id: string; // Relación con Ad
    hook: string;
    guion: string;
    copy_principal: string;
    copy_corto: string;
    cta: string;
    referencias_visuales?: string[];
}

// 7. Contenido Editorial (El planner mixto orgánico/proyectos)
export interface IEditorialContent extends Document {
    empresa_id: string; // Obligatorio
    proyecto_id?: string; // Opcional (si no hay, es "Contenido de Marca" puro)
    tipo_contenido: 'Contenido de marca' | 'Contenido de proyecto' | 'Fecha especial' | 'Expectativa' | 'Entrega' | 'Prueba social' | 'Educativo' | 'Lifestyle' | 'Comunidad';
    categoria?: string;
    tema: string;
    objetivo: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
}

// 8. Calendario (Programación)
export interface ICalendar extends Document {
    contenido_id: string; // Puede apuntar a IEditorialContent, ICreative o ser independiente temporalmente
    fecha: string; // YYYY-MM-DD
    dia: string;
    hora: string; // HH:MM
    responsable: string;
    estado: 'Idea' | 'Brief' | 'Copy' | 'Guion' | 'Grabación' | 'Edición' | 'Revisión' | 'Aprobado' | 'Programado' | 'Publicado' | 'Activo';
    tiempo_edicion?: number; // En minutos u horas
    fecha_limite?: string;
}

// 9. Métrica
export interface IMetric extends Document {
    campana_id?: string;
    conjunto_id?: string;
    anuncio_id?: string;
    fecha: string;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    cpl: number;
    leads: number;
}


// --- Schemas ---

const CompanySchema = new Schema({
    empresaId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    tipo: { type: String, default: 'Principal' },
    estado: { type: String, default: 'Activo' },
    logo: { type: String },
    color: { type: String }
}, { timestamps: true });

const ProjectSchema = new Schema({
    empresaId: { type: String, required: true, index: true },
    nombre: { type: String, required: true },
    tipo_proyecto: { type: String, required: true, enum: ['Marca de proyecto', 'Proyecto simple', 'Masterplan'] },
    descripcion: { type: String },
    estado_comercial: { type: String, required: true, default: 'Activo' },
    branding: {
        logo: String,
        colores: [String],
        redes_sociales: {
            instagram: String,
            facebook: String,
            tiktok: String,
            web: String
        },
        linea_comunicacion: String
    }
}, { timestamps: true });

const CampaignSchema = new Schema({
    proyecto_id: { type: String },
    empresa_id: { type: String, required: true },
    nombre: { type: String, required: true },
    objetivo: { type: String, required: true },
    presupuesto: { type: Number, default: 0 },
    estado: { type: String, default: 'Borrador' },
    fecha_inicio: { type: String },
    fecha_fin: { type: String }
}, { timestamps: true });

const AdSetSchema = new Schema({
    campana_id: { type: String, required: true, index: true },
    nombre: { type: String, required: true },
    tipo_segmento: { type: String, required: true },
    audiencia: { type: String },
    presupuesto: { type: Number, default: 0 },
    estado: { type: String, default: 'Borrador' }
}, { timestamps: true });

const AdSchema = new Schema({
    conjunto_id: { type: String, required: true, index: true },
    nombre: { type: String, required: true },
    formato: { type: String },
    objetivo: { type: String },
    estado: { type: String, default: 'Borrador' }
}, { timestamps: true });

const CreativeSchema = new Schema({
    anuncio_id: { type: String, required: true, unique: true },
    hook: { type: String },
    guion: { type: String },
    copy_principal: { type: String },
    copy_corto: { type: String },
    cta: { type: String },
    referencias_visuales: [{ type: String }]
}, { timestamps: true });

const EditorialContentSchema = new Schema({
    empresa_id: { type: String, required: true, index: true },
    proyecto_id: { type: String },
    tipo_contenido: { type: String, required: true },
    categoria: { type: String },
    tema: { type: String, required: true },
    objetivo: { type: String },
    prioridad: { type: String, default: 'Media' }
}, { timestamps: true });

const CalendarSchema = new Schema({
    contenido_id: { type: String, required: true },
    fecha: { type: String, required: true },
    dia: { type: String },
    hora: { type: String },
    responsable: { type: String },
    estado: {
        type: String,
        required: true,
        enum: ['Idea', 'Brief', 'Copy', 'Guion', 'Grabación', 'Edición', 'Revisión', 'Aprobado', 'Programado', 'Publicado', 'Activo'],
        default: 'Idea'
    },
    tiempo_edicion: { type: Number },
    fecha_limite: { type: String }
}, { timestamps: true });

const MetricSchema = new Schema({
    campana_id: { type: String },
    conjunto_id: { type: String },
    anuncio_id: { type: String },
    fecha: { type: String },
    spend: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpl: { type: Number, default: 0 },
    leads: { type: Number, default: 0 }
}, { timestamps: true });


// --- Exports ---
export const Company = mongoose.models.CompanyV3 || mongoose.model<ICompany>('CompanyV3', CompanySchema);
export const Project = mongoose.models.ProjectV3 || mongoose.model<IProject>('ProjectV3', ProjectSchema);
export const Campaign = mongoose.models.CampaignV3 || mongoose.model<ICampaign>('CampaignV3', CampaignSchema);
export const AdSet = mongoose.models.AdSetV3 || mongoose.model<IAdSet>('AdSetV3', AdSetSchema);
export const Ad = mongoose.models.AdV3 || mongoose.model<IAd>('AdV3', AdSchema);
export const Creative = mongoose.models.CreativeV3 || mongoose.model<ICreative>('CreativeV3', CreativeSchema);
export const EditorialContent = mongoose.models.EditorialContentV3 || mongoose.model<IEditorialContent>('EditorialContentV3', EditorialContentSchema);
export const Calendar = mongoose.models.CalendarV3 || mongoose.model<ICalendar>('CalendarV3', CalendarSchema);
export const Metric = mongoose.models.MetricV3 || mongoose.model<IMetric>('MetricV3', MetricSchema);
