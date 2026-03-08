import mongoose, { Schema, Document } from 'mongoose';

// --- Interfaces ---
export interface ICompany extends Document {
    nombre: string;
    logo: string;
    color: string;
}

export interface IBrandIdentity extends Document {
    empresaId: mongoose.Types.ObjectId;
    base: {
        queEs: string;
        nicho: string;
        propuesta: string;
        tono: string;
    };
    personas: Array<{
        nombre: string;
        edad: string;
        problema: string;
        deseo: string;
        objecion: string;
    }>;
}

export interface IProject extends Document {
    empresaId: mongoose.Types.ObjectId;
    nombre: string;
    estado: string;
    ticket: string;
    fechaCierre: string;
    responsable: string;
}

export interface IStrategy extends Document {
    proyectoId: mongoose.Types.ObjectId;
    nombre: string;
    objetivo: string;
    conjuntos: Array<{
        nombre: string;
        anuncios: Array<{
            nombre: string;
            formato: string;
            metodologia: string;
            contenido: string;
            cpl: string;
        }>;
    }>;
}

export interface IPlanner extends Document {
    proyecto: string;
    contenido: string;
    formato: string;
    grabacion: string;
    publicacion: string;
    responsable: string;
    estado: string;
}

export interface IMetrics extends Document {
    leads: number;
    cplPromedio: string;
    roi: string;
    inversion: string;
}

// --- Schemas ---
const CompanySchema = new Schema({
    nombre: { type: String, required: true },
    logo: { type: String, required: true },
    color: { type: String, required: true }
}, { timestamps: true });

const BrandIdentitySchema = new Schema({
    empresaId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    base: {
        queEs: String,
        nicho: String,
        propuesta: String,
        tono: String
    },
    personas: [{
        nombre: String,
        edad: String,
        problema: String,
        deseo: String,
        objecion: String
    }]
}, { timestamps: true });

const ProjectSchema = new Schema({
    empresaId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    nombre: { type: String, required: true },
    estado: { type: String, required: true },
    ticket: { type: String, required: true },
    fechaCierre: { type: String, required: true },
    responsable: { type: String, required: true },
}, { timestamps: true });

const StrategySchema = new Schema({
    proyectoId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    nombre: { type: String, required: true },
    objetivo: { type: String, required: true },
    conjuntos: [{
        nombre: String,
        anuncios: [{
            nombre: String,
            formato: String,
            metodologia: String,
            contenido: String,
            cpl: String
        }]
    }]
}, { timestamps: true });

const PlannerSchema = new Schema({
    proyecto: { type: String, required: true },
    contenido: { type: String, required: true },
    formato: { type: String, required: true },
    grabacion: { type: String },
    publicacion: { type: String },
    responsable: { type: String },
    estado: { type: String, required: true }
}, { timestamps: true });

const MetricsSchema = new Schema({
    leads: { type: Number, required: true },
    cplPromedio: { type: String, required: true },
    roi: { type: String, required: true },
    inversion: { type: String, required: true }
}, { timestamps: true });

// --- Exports ---
export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
export const BrandIdentity = mongoose.models.BrandIdentity || mongoose.model<IBrandIdentity>('BrandIdentity', BrandIdentitySchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const Strategy = mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', StrategySchema);
export const Planner = mongoose.models.Planner || mongoose.model<IPlanner>('Planner', PlannerSchema);
export const Metrics = mongoose.models.Metrics || mongoose.model<IMetrics>('Metrics', MetricsSchema);
