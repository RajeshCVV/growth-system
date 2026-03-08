import mongoose, { Schema, Document } from 'mongoose';

// --- Interfaces (Contratos de Datos) ---
export interface ICompany extends Document {
    empresaId: string;
    nombre: string;
    logo: string;
    color: string;
}

export interface IBrandIdentity extends Document {
    empresaId: string;
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
    empresaId: string;
    nombre: string;
    estado: string;
    ticket: string;
    fechaCierre: string;
    responsable: string;
}

export interface IStrategy extends Document {
    empresaId: string; // Relación directa con la empresa por slug
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

// --- Schemas ---
const CompanySchema = new Schema({
    empresaId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    logo: { type: String },
    color: { type: String }
}, { timestamps: true });

const BrandIdentitySchema = new Schema({
    empresaId: { type: String, required: true },
    base: { queEs: String, nicho: String, propuesta: String, tono: String },
    personas: [{ nombre: String, edad: String, problema: String, deseo: String, objecion: String }]
}, { timestamps: true });

const ProjectSchema = new Schema({
    empresaId: { type: String, required: true },
    nombre: { type: String, required: true },
    estado: { type: String, required: true },
    ticket: { type: String, required: true },
    fechaCierre: { type: String, required: true },
    responsable: { type: String, required: true },
}, { timestamps: true });

const StrategySchema = new Schema({
    empresaId: { type: String, required: true }, // Cambiado para que coincida con el slug 'fortis'
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

// --- Exports ---
export const Company = mongoose.models.CompanyV2 || mongoose.model<ICompany>('CompanyV2', CompanySchema);
export const BrandIdentity = mongoose.models.BrandIdentityV2 || mongoose.model<IBrandIdentity>('BrandIdentityV2', BrandIdentitySchema);
export const Project = mongoose.models.ProjectV2 || mongoose.model<IProject>('ProjectV2', ProjectSchema);
export const Strategy = mongoose.models.StrategyV2 || mongoose.model<IStrategy>('StrategyV2', StrategySchema);
export const Planner = mongoose.models.PlannerV2 || mongoose.model<IPlanner>('PlannerV2', PlannerSchema);
