"use client";
import { useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import idl from "@/idl/backend.json";
import * as web3 from "@solana/web3.js";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
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

            const accountInfo = await connection.getAccountInfo(devAccount, "processed");
            if (accountInfo !== null) {
                alert("La red aún detecta tu perfil anterior. Por favor, espera 5-10 segundos.");
                setLoading(false);
                return;
            }

            const registerMethod = (program.methods as any).register_developer || (program.methods as any).registerDeveloper;

            await registerMethod(
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
                system_program: web3.SystemProgram.programId,
            }).rpc({ skipPreflight: true });

            alert("¡Perfil registrado con éxito!");
            onClose();
        } catch (err: any) {
            console.error(err);
            // Si el error es de cuenta ya existente, damos un mensaje claro
            if (err.logs && err.logs.some((log: string) => log.includes("already in use"))) {
                alert("Error: Tu cuenta de desarrollador ya existe en la red.");
            } else {
                alert("Error al procesar la transacción. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-card w-full max-w-md p-8 border border-white/10 rounded-[30px] bg-slate-900 shadow-2xl relative z-20">
                <h2 className="text-xl font-bold text-white mb-6 uppercase">REGISTRO DE TALENTO</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="name" placeholder="Nombre" required className="bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                        <input name="lastName" placeholder="Apellido" required className="bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                    </div>
                    <input name="techs" placeholder="Techs (Go, Rust, React...)" required className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="city" placeholder="Ciudad" required className="bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                        <input name="country" placeholder="País" required className="bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                    </div>
                    <input name="contact" placeholder="Email o Telegram" required className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />
                    <input name="rate" type="number" placeholder="Tarifa $/Hora" required className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10" />

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400">CERRAR</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold text-white">
                            {loading ? "PROCESANDO..." : "REGISTRARME"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}