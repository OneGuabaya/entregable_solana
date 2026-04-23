"use client";
import { useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import idl from "@/idl/backend.json";
import * as web3 from "@solana/web3.js";

export default function EditModal({ dev, onClose }: { dev: any, onClose: () => void }) {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!wallet) return;
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const provider = new AnchorProvider(connection, wallet, { commitment: "processed" });
        const program = new Program(idl as Idl, provider);

        try {
            const [devAccount] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("developer"), wallet.publicKey.toBuffer()],
                program.programId
            );

            const updateMethod = (program.methods as any).update_developer || (program.methods as any).updateDeveloper;

            await updateMethod(
                formData.get("name"),
                formData.get("lastName"),
                formData.get("city"),
                formData.get("country"),
                formData.get("contact"),
                formData.get("techs"),
                new BN(formData.get("rate") as string)
            ).accounts({
                dev_account: devAccount,
                user: wallet.publicKey,
            }).rpc({ skipPreflight: true });

            alert("¡Perfil actualizado!");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al actualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-card w-full max-w-lg p-8 border border-white/10 rounded-[30px] bg-slate-900 shadow-2xl relative">
                <h2 className="text-2xl font-black text-white mb-6 uppercase italic">
                    EDITAR <span className="text-indigo-400">PERFIL</span>
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Nombre: usualmente se mantiene igual */}
                    <input
                        name="name"
                        defaultValue={dev.name}
                        placeholder="Nombre"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    {/* APELLIDO: Cambiado de dev.last_name a dev.lastName */}
                    <input
                        name="lastName"
                        defaultValue={dev.lastName || dev.last_name || ""}
                        placeholder="Apellido"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    <input
                        name="city"
                        defaultValue={dev.city}
                        placeholder="Ciudad"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    <input
                        name="country"
                        defaultValue={dev.country}
                        placeholder="País"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    <input
                        name="techs"
                        defaultValue={dev.techs}
                        placeholder="Techs (React, Go...)"
                        required
                        className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    <input
                        name="contact"
                        defaultValue={dev.contact}
                        placeholder="Contacto"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    {/* TARIFA: Cambiado de dev.hourly_rate a dev.hourlyRate */}
                    <input
                        name="rate"
                        type="number"
                        defaultValue={dev.hourlyRate?.toString() || dev.hourly_rate?.toString() || ""}
                        placeholder="$/H"
                        required
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                    />

                    <div className="col-span-2 flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-white transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}