

export class IngresoEgreso {
    description: string;
    monto: number;
    tipo: string;
    uid?: string;

    constructor(obj) {
        this.description = obj && obj.description || null;
        this.monto       = obj && obj.monto || null;
        this.tipo        = obj && obj.tipo || null;
        // this.uid         = obj && obj.uid || null;
    }
}